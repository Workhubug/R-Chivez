import { v4 as uuidv4 } from 'uuid';

// Mock data storage in localStorage
const STORAGE_KEYS = {
  USERS: 'rchivez_users',
  FILES: 'rchivez_files',
  TRANSACTIONS: 'rchivez_transactions',
  CURRENT_USER: 'rchivez_current_user',
  TOKEN: 'rchivez_token',
};

// Initialize with demo data
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FILES)) {
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify({}));
  }
};

// ============ USER FUNCTIONS ============

export const mockRegister = async (email, password, artistName) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');

  if (users[email]) {
    throw new Error('Email already registered');
  }

  const userId = uuidv4();
  const newUser = {
    id: userId,
    email,
    password, // In real app, this would be hashed
    artist_name: artistName,
    created_at: new Date().toISOString(),
    wallet_balance: 0.0,
  };

  users[email] = newUser;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const token = generateMockToken(userId);
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

  return {
    access_token: token,
    user: newUser,
  };
};

export const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  const user = users[email];

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateMockToken(user.id);
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

  return {
    access_token: token,
    user,
  };
};

export const mockGetCurrentUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userStr) {
    throw new Error('User not found');
  }

  return JSON.parse(userStr);
};

export const mockLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ============ FILE FUNCTIONS ============

export const mockCreateFile = async (fileData, userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  
  const fileId = uuidv4();
  const newFile = {
    id: fileId,
    user_id: userId,
    title: fileData.title,
    file_type: fileData.file_type || 'audio',
    duration: fileData.duration || null,
    genre: fileData.genre || null,
    is_archived: true,
    is_distributed: false,
    is_licensed: false,
    distribution_platforms: [],
    license_type: null,
    license_price: null,
    metadata: {},
    created_at: new Date().toISOString(),
    streams: 0,
    earnings: 0.0,
  };

  if (!files[userId]) {
    files[userId] = [];
  }

  files[userId].push(newFile);
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

  return newFile;
};

export const mockGetFiles = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  return files[userId] || [];
};

export const mockGetFile = async (fileId, userId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  const userFiles = files[userId] || [];
  const file = userFiles.find(f => f.id === fileId);

  if (!file) {
    throw new Error('File not found');
  }

  return file;
};

export const mockUpdateFile = async (fileId, updates, userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  const userFiles = files[userId] || [];
  const fileIndex = userFiles.findIndex(f => f.id === fileId);

  if (fileIndex === -1) {
    throw new Error('File not found');
  }

  const updatedFile = {
    ...userFiles[fileIndex],
    ...Object.entries(updates).reduce((acc, [key, val]) => {
      if (val !== null && val !== undefined) {
        acc[key] = val;
      }
      return acc;
    }, {}),
  };

  userFiles[fileIndex] = updatedFile;
  files[userId] = userFiles;
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

  return updatedFile;
};

export const mockDeleteFile = async (fileId, userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  const userFiles = files[userId] || [];
  const fileIndex = userFiles.findIndex(f => f.id === fileId);

  if (fileIndex === -1) {
    throw new Error('File not found');
  }

  userFiles.splice(fileIndex, 1);
  files[userId] = userFiles;
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

  return { message: 'File deleted' };
};

// ============ WALLET FUNCTIONS ============

export const mockGetWalletBalance = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  let userRecord = null;
  
  for (const user of Object.values(users)) {
    if (user.id === userId) {
      userRecord = user;
      break;
    }
  }

  if (!userRecord) {
    throw new Error('User not found');
  }

  return { balance: userRecord.wallet_balance || 0.0 };
};

export const mockGetTransactions = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
  return (transactions[userId] || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const mockWithdraw = async (amount, method, details, userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  let userRecord = null;
  let userEmail = null;

  for (const [email, user] of Object.entries(users)) {
    if (user.id === userId) {
      userRecord = user;
      userEmail = email;
      break;
    }
  }

  if (!userRecord || userRecord.wallet_balance < amount) {
    throw new Error('Insufficient balance');
  }

  const txId = uuidv4();
  const newTx = {
    id: txId,
    user_id: userId,
    amount: -amount,
    transaction_type: 'withdrawal',
    description: `Withdrawal via ${method}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    method,
    details,
  };

  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
  if (!transactions[userId]) {
    transactions[userId] = [];
  }
  transactions[userId].push(newTx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

  userRecord.wallet_balance -= amount;
  users[userEmail] = userRecord;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userRecord));

  return {
    message: 'Withdrawal initiated',
    transaction_id: txId,
    new_balance: userRecord.wallet_balance,
  };
};

// ============ ANALYTICS FUNCTIONS ============

export const mockGetAnalytics = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  const userFiles = files[userId] || [];

  const totalStreams = userFiles.reduce((sum, f) => sum + (f.streams || 0), 0) || getRandomInt(5000, 50000);
  const totalEarnings = userFiles.reduce((sum, f) => sum + (f.earnings || 0), 0) || getRandomFloat(500, 5000);

  // Generate mock daily data
  const streamsbyDay = [];
  const earningsbyDay = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    streamsbyDay.push({
      date: dateStr,
      streams: getRandomInt(100, 5000),
    });
    
    earningsbyDay.push({
      date: dateStr,
      earnings: parseFloat(getRandomFloat(10, 200).toFixed(2)),
    });
  }

  // Mock geographic data
  const streamsByCountry = [
    { country: 'Nigeria', streams: getRandomInt(10000, 50000), code: 'NG' },
    { country: 'South Africa', streams: getRandomInt(8000, 40000), code: 'ZA' },
    { country: 'Kenya', streams: getRandomInt(5000, 25000), code: 'KE' },
    { country: 'Ghana', streams: getRandomInt(4000, 20000), code: 'GH' },
    { country: 'Tanzania', streams: getRandomInt(3000, 15000), code: 'TZ' },
    { country: 'Egypt', streams: getRandomInt(2000, 12000), code: 'EG' },
    { country: 'USA', streams: getRandomInt(5000, 30000), code: 'US' },
    { country: 'UK', streams: getRandomInt(3000, 18000), code: 'GB' },
  ];

  return {
    total_streams: totalStreams,
    total_earnings: totalEarnings,
    total_files: userFiles.length,
    archived_files: userFiles.filter(f => f.is_archived).length,
    distributed_files: userFiles.filter(f => f.is_distributed).length,
    licensed_files: userFiles.filter(f => f.is_licensed).length,
    streams_by_day: streamsbyDay,
    earnings_by_day: earningsbyDay,
    streams_by_country: streamsByCountry,
  };
};

// ============ DEMO DATA FUNCTIONS ============

export const mockSeedDemoData = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const demoFiles = [
    { title: 'Afrobeats Sunset', file_type: 'audio', duration: 245, genre: 'Afrobeats' },
    { title: 'Lagos Nights', file_type: 'audio', duration: 312, genre: 'Afro-House' },
    { title: 'Savannah Dreams', file_type: 'audio', duration: 198, genre: 'Afropop' },
    { title: 'Desert Wind', file_type: 'audio', duration: 267, genre: 'World' },
    { title: 'Naija Groove', file_type: 'audio', duration: 224, genre: 'Afrobeats' },
    { title: 'Golden Hour', file_type: 'video', duration: 180, genre: 'Visual' },
  ];

  const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '{}');
  if (!files[userId]) {
    files[userId] = [];
  }

  const createdFiles = [];
  let totalEarnings = 0;

  for (const f of demoFiles) {
    const fileId = uuidv4();
    const streams = getRandomInt(1000, 100000);
    const earnings = getRandomFloat(50, 2000);
    totalEarnings += earnings;

    const newFile = {
      id: fileId,
      user_id: userId,
      title: f.title,
      file_type: f.file_type,
      duration: f.duration,
      genre: f.genre,
      is_archived: true,
      is_distributed: Math.random() > 0.5,
      is_licensed: Math.random() > 0.5,
      distribution_platforms: Math.random() > 0.5 ? getRandomPlatforms() : [],
      license_type: Math.random() > 0.5 ? getRandomLicense() : null,
      license_price: Math.random() > 0.5 ? parseFloat(getRandomFloat(50, 500).toFixed(2)) : null,
      metadata: {},
      created_at: new Date().toISOString(),
      streams,
      earnings: parseFloat(earnings.toFixed(2)),
    };

    files[userId].push(newFile);
    createdFiles.push(newFile);
  }

  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

  // Add earnings to wallet
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  let userEmail = null;

  for (const [email, user] of Object.entries(users)) {
    if (user.id === userId) {
      userEmail = email;
      user.wallet_balance = (user.wallet_balance || 0) + totalEarnings;
      users[email] = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      break;
    }
  }

  if (userEmail) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Create transaction history
  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
  if (!transactions[userId]) {
    transactions[userId] = [];
  }

  for (const file of createdFiles) {
    if (file.earnings > 0) {
      transactions[userId].push({
        id: uuidv4(),
        user_id: userId,
        amount: file.earnings,
        transaction_type: 'earning',
        description: `Streaming revenue - ${file.title}`,
        status: 'completed',
        created_at: file.created_at,
      });
    }
  }

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

  return {
    message: `Seeded ${createdFiles.length} demo files`,
    files: createdFiles,
  };
};

// ============ HELPER FUNCTIONS ============

const generateMockToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    exp: Math.floor(Date.now() / 1000) + 86400 
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomPlatforms = () => {
  const platforms = ['spotify', 'apple_music', 'boomplay', 'youtube_music', 'amazon_music'];
  return platforms.slice(0, getRandomInt(1, 3));
};

const getRandomLicense = () => {
  const licenses = ['sync', 'nft', 'commercial'];
  return licenses[getRandomInt(0, licenses.length - 1)];
};
