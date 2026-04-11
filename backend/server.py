from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'ziki-tunes-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

# Create the main app
app = FastAPI(title="Ziki Tunes Artist Admin API")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    artist_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    artist_name: str
    created_at: str
    wallet_balance: float = 0.0

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class FileCreate(BaseModel):
    title: str
    file_type: str = "audio"  # audio, video, image
    duration: Optional[int] = None
    genre: Optional[str] = None

class FileUpdate(BaseModel):
    is_archived: Optional[bool] = None
    is_distributed: Optional[bool] = None
    is_licensed: Optional[bool] = None
    distribution_platforms: Optional[List[str]] = None
    license_type: Optional[str] = None
    license_price: Optional[float] = None
    metadata: Optional[dict] = None

class FileResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    title: str
    file_type: str
    duration: Optional[int] = None
    genre: Optional[str] = None
    is_archived: bool = True
    is_distributed: bool = False
    is_licensed: bool = False
    distribution_platforms: List[str] = []
    license_type: Optional[str] = None
    license_price: Optional[float] = None
    metadata: dict = {}
    created_at: str
    streams: int = 0
    earnings: float = 0.0

class TransactionResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    amount: float
    transaction_type: str  # earning, withdrawal, deposit
    description: str
    status: str  # pending, completed, failed
    created_at: str

class WithdrawRequest(BaseModel):
    amount: float
    method: str  # mobile_money, bank, paypal
    details: dict = {}

class AnalyticsResponse(BaseModel):
    total_streams: int
    total_earnings: float
    total_files: int
    archived_files: int
    distributed_files: int
    licensed_files: int
    streams_by_day: List[dict]
    earnings_by_day: List[dict]
    streams_by_country: List[dict]

# ============ AUTH HELPERS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "artist_name": user_data.artist_name,
        "created_at": now,
        "wallet_balance": 0.0
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id)
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        artist_name=user_data.artist_name,
        created_at=now,
        wallet_balance=0.0
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        artist_name=user["artist_name"],
        created_at=user["created_at"],
        wallet_balance=user.get("wallet_balance", 0.0)
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        artist_name=user["artist_name"],
        created_at=user["created_at"],
        wallet_balance=user.get("wallet_balance", 0.0)
    )

# ============ FILES ROUTES ============

@api_router.post("/files", response_model=FileResponse)
async def create_file(file_data: FileCreate, user = Depends(get_current_user)):
    file_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    file_doc = {
        "id": file_id,
        "user_id": user["id"],
        "title": file_data.title,
        "file_type": file_data.file_type,
        "duration": file_data.duration,
        "genre": file_data.genre,
        "is_archived": True,
        "is_distributed": False,
        "is_licensed": False,
        "distribution_platforms": [],
        "license_type": None,
        "license_price": None,
        "metadata": {},
        "created_at": now,
        "streams": 0,
        "earnings": 0.0
    }
    
    await db.files.insert_one(file_doc)
    return FileResponse(**file_doc)

@api_router.get("/files", response_model=List[FileResponse])
async def get_files(user = Depends(get_current_user)):
    files = await db.files.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    return [FileResponse(**f) for f in files]

@api_router.get("/files/{file_id}", response_model=FileResponse)
async def get_file(file_id: str, user = Depends(get_current_user)):
    file = await db.files.find_one({"id": file_id, "user_id": user["id"]}, {"_id": 0})
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(**file)

@api_router.patch("/files/{file_id}", response_model=FileResponse)
async def update_file(file_id: str, update_data: FileUpdate, user = Depends(get_current_user)):
    file = await db.files.find_one({"id": file_id, "user_id": user["id"]})
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.files.update_one({"id": file_id}, {"$set": update_dict})
    
    updated = await db.files.find_one({"id": file_id}, {"_id": 0})
    return FileResponse(**updated)

@api_router.delete("/files/{file_id}")
async def delete_file(file_id: str, user = Depends(get_current_user)):
    result = await db.files.delete_one({"id": file_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted"}

# ============ WALLET ROUTES ============

@api_router.get("/wallet/balance")
async def get_wallet_balance(user = Depends(get_current_user)):
    return {"balance": user.get("wallet_balance", 0.0)}

@api_router.get("/wallet/transactions", response_model=List[TransactionResponse])
async def get_transactions(user = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return [TransactionResponse(**t) for t in transactions]

@api_router.post("/wallet/withdraw")
async def withdraw(request: WithdrawRequest, user = Depends(get_current_user)):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    if request.amount > user.get("wallet_balance", 0):
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    tx_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    tx_doc = {
        "id": tx_id,
        "user_id": user["id"],
        "amount": -request.amount,
        "transaction_type": "withdrawal",
        "description": f"Withdrawal via {request.method}",
        "status": "pending",
        "created_at": now,
        "method": request.method,
        "details": request.details
    }
    
    await db.transactions.insert_one(tx_doc)
    new_balance = user.get("wallet_balance", 0) - request.amount
    await db.users.update_one({"id": user["id"]}, {"$set": {"wallet_balance": new_balance}})
    
    return {"message": "Withdrawal initiated", "transaction_id": tx_id, "new_balance": new_balance}

# ============ ANALYTICS ROUTES ============

@api_router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(user = Depends(get_current_user)):
    files = await db.files.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    
    total_streams = sum(f.get("streams", 0) for f in files)
    total_earnings = sum(f.get("earnings", 0) for f in files)
    
    # Generate mock daily data for last 30 days
    streams_by_day = []
    earnings_by_day = []
    import random
    for i in range(30):
        day = (datetime.now(timezone.utc) - timedelta(days=29-i)).strftime("%Y-%m-%d")
        streams_by_day.append({"date": day, "streams": random.randint(100, 5000)})
        earnings_by_day.append({"date": day, "earnings": round(random.uniform(10, 200), 2)})
    
    # Mock geographic data (Africa focus)
    streams_by_country = [
        {"country": "Nigeria", "streams": random.randint(10000, 50000), "code": "NG"},
        {"country": "South Africa", "streams": random.randint(8000, 40000), "code": "ZA"},
        {"country": "Kenya", "streams": random.randint(5000, 25000), "code": "KE"},
        {"country": "Ghana", "streams": random.randint(4000, 20000), "code": "GH"},
        {"country": "Tanzania", "streams": random.randint(3000, 15000), "code": "TZ"},
        {"country": "Egypt", "streams": random.randint(2000, 12000), "code": "EG"},
        {"country": "USA", "streams": random.randint(5000, 30000), "code": "US"},
        {"country": "UK", "streams": random.randint(3000, 18000), "code": "GB"},
    ]
    
    return AnalyticsResponse(
        total_streams=total_streams if total_streams > 0 else sum(s["streams"] for s in streams_by_day),
        total_earnings=total_earnings if total_earnings > 0 else sum(e["earnings"] for e in earnings_by_day),
        total_files=len(files),
        archived_files=len([f for f in files if f.get("is_archived")]),
        distributed_files=len([f for f in files if f.get("is_distributed")]),
        licensed_files=len([f for f in files if f.get("is_licensed")]),
        streams_by_day=streams_by_day,
        earnings_by_day=earnings_by_day,
        streams_by_country=streams_by_country
    )

# ============ DEMO DATA ============

@api_router.post("/demo/seed")
async def seed_demo_data(user = Depends(get_current_user)):
    """Seed demo files for testing"""
    demo_files = [
        {"title": "Afrobeats Sunset", "file_type": "audio", "duration": 245, "genre": "Afrobeats"},
        {"title": "Lagos Nights", "file_type": "audio", "duration": 312, "genre": "Afro-House"},
        {"title": "Savannah Dreams", "file_type": "audio", "duration": 198, "genre": "Afropop"},
        {"title": "Desert Wind", "file_type": "audio", "duration": 267, "genre": "World"},
        {"title": "Naija Groove", "file_type": "audio", "duration": 224, "genre": "Afrobeats"},
        {"title": "Golden Hour", "file_type": "video", "duration": 180, "genre": "Visual"},
    ]
    
    import random
    created_files = []
    for f in demo_files:
        file_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        file_doc = {
            "id": file_id,
            "user_id": user["id"],
            "title": f["title"],
            "file_type": f["file_type"],
            "duration": f["duration"],
            "genre": f["genre"],
            "is_archived": True,
            "is_distributed": random.choice([True, False]),
            "is_licensed": random.choice([True, False]),
            "distribution_platforms": random.sample(["spotify", "apple_music", "boomplay"], k=random.randint(0, 3)) if random.choice([True, False]) else [],
            "license_type": random.choice(["sync", "nft", "commercial", None]),
            "license_price": round(random.uniform(50, 500), 2) if random.choice([True, False]) else None,
            "metadata": {},
            "created_at": now,
            "streams": random.randint(1000, 100000),
            "earnings": round(random.uniform(50, 2000), 2)
        }
        
        await db.files.insert_one(file_doc)
        created_files.append(file_doc)
    
    # Add some earnings to wallet
    total_earnings = sum(f["earnings"] for f in created_files)
    await db.users.update_one(
        {"id": user["id"]}, 
        {"$inc": {"wallet_balance": total_earnings}}
    )
    
    # Create some transaction history
    for f in created_files:
        if f["earnings"] > 0:
            tx_doc = {
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "amount": f["earnings"],
                "transaction_type": "earning",
                "description": f"Streaming revenue - {f['title']}",
                "status": "completed",
                "created_at": f["created_at"]
            }
            await db.transactions.insert_one(tx_doc)
    
    return {"message": f"Seeded {len(created_files)} demo files", "files": [FileResponse(**f) for f in created_files]}

# ============ HEALTH CHECK ============

@api_router.get("/")
async def root():
    return {"message": "Ziki Tunes API", "status": "healthy"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
