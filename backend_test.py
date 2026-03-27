import requests
import sys
import json
from datetime import datetime

class ZikiTunesAPITester:
    def __init__(self, base_url="https://ziki-artist-admin.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_flow(self):
        """Test authentication flow"""
        print("\n🔍 Testing Authentication...")
        
        # Generate unique test user
        timestamp = datetime.now().strftime('%H%M%S')
        test_email = f"test_artist_{timestamp}@zikitunes.com"
        test_password = "TestPass123!"
        test_artist_name = f"Test Artist {timestamp}"

        # Test registration
        register_data = {
            "email": test_email,
            "password": test_password,
            "artist_name": test_artist_name
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log_test("Token Extraction", True)
        else:
            self.log_test("Token Extraction", False, "No token in response")
            return False

        # Test login with same credentials
        login_data = {
            "email": test_email,
            "password": test_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )

        # Test get current user
        self.run_test("Get Current User", "GET", "auth/me", 200)

        # Test invalid login
        invalid_login = {
            "email": test_email,
            "password": "wrongpassword"
        }
        self.run_test("Invalid Login", "POST", "auth/login", 401, data=invalid_login)

        return True

    def test_files_crud(self):
        """Test file CRUD operations"""
        print("\n🔍 Testing File Operations...")
        
        if not self.token:
            self.log_test("Files CRUD", False, "No authentication token")
            return

        # Test get files (empty initially)
        self.run_test("Get Files (Empty)", "GET", "files", 200)

        # Test create file
        file_data = {
            "title": "Test Track",
            "file_type": "audio",
            "duration": 180,
            "genre": "Afrobeats"
        }
        
        success, response = self.run_test(
            "Create File",
            "POST",
            "files",
            200,
            data=file_data
        )
        
        file_id = None
        if success and 'id' in response:
            file_id = response['id']
            self.log_test("File ID Extraction", True)
        else:
            self.log_test("File ID Extraction", False, "No file ID in response")
            return

        # Test get specific file
        self.run_test("Get Specific File", "GET", f"files/{file_id}", 200)

        # Test update file
        update_data = {
            "is_distributed": True,
            "distribution_platforms": ["spotify", "apple_music"],
            "is_licensed": True,
            "license_type": "sync",
            "license_price": 250.0
        }
        
        self.run_test(
            "Update File",
            "PATCH",
            f"files/{file_id}",
            200,
            data=update_data
        )

        # Test get files (should have 1 file now)
        success, response = self.run_test("Get Files (With Data)", "GET", "files", 200)
        if success and isinstance(response, list) and len(response) > 0:
            self.log_test("File List Validation", True)
        else:
            self.log_test("File List Validation", False, "Expected non-empty file list")

        # Test delete file
        self.run_test("Delete File", "DELETE", f"files/{file_id}", 200)

        # Test get deleted file (should fail)
        self.run_test("Get Deleted File", "GET", f"files/{file_id}", 404)

    def test_demo_data(self):
        """Test demo data seeding"""
        print("\n🔍 Testing Demo Data...")
        
        if not self.token:
            self.log_test("Demo Data", False, "No authentication token")
            return

        success, response = self.run_test("Seed Demo Data", "POST", "demo/seed", 200)
        
        if success and 'files' in response:
            files_count = len(response['files'])
            if files_count > 0:
                self.log_test("Demo Files Created", True, f"Created {files_count} files")
            else:
                self.log_test("Demo Files Created", False, "No files in response")
        else:
            self.log_test("Demo Files Created", False, "No files in response")

    def test_analytics(self):
        """Test analytics endpoint"""
        print("\n🔍 Testing Analytics...")
        
        if not self.token:
            self.log_test("Analytics", False, "No authentication token")
            return

        success, response = self.run_test("Get Analytics", "GET", "analytics", 200)
        
        if success:
            required_fields = ['total_streams', 'total_earnings', 'total_files', 'streams_by_day', 'earnings_by_day', 'streams_by_country']
            missing_fields = [field for field in required_fields if field not in response]
            
            if not missing_fields:
                self.log_test("Analytics Data Structure", True)
            else:
                self.log_test("Analytics Data Structure", False, f"Missing fields: {missing_fields}")

    def test_wallet_operations(self):
        """Test wallet operations"""
        print("\n🔍 Testing Wallet Operations...")
        
        if not self.token:
            self.log_test("Wallet Operations", False, "No authentication token")
            return

        # Test get balance
        self.run_test("Get Wallet Balance", "GET", "wallet/balance", 200)

        # Test get transactions
        self.run_test("Get Transactions", "GET", "wallet/transactions", 200)

        # Test withdrawal (should fail with insufficient balance initially)
        withdraw_data = {
            "amount": 10.0,
            "method": "mobile_money",
            "details": {"phone": "+1234567890"}
        }
        
        # This might fail with insufficient balance, which is expected
        success, response = self.run_test(
            "Test Withdrawal",
            "POST",
            "wallet/withdraw",
            400,  # Expecting 400 for insufficient balance
            data=withdraw_data
        )

    def test_error_handling(self):
        """Test error handling"""
        print("\n🔍 Testing Error Handling...")
        
        # Test unauthorized access
        old_token = self.token
        self.token = None
        self.run_test("Unauthorized Access", "GET", "files", 401)
        self.token = old_token

        # Test invalid token
        old_token = self.token
        self.token = "invalid_token"
        self.run_test("Invalid Token", "GET", "files", 401)
        self.token = old_token

        # Test non-existent file
        self.run_test("Non-existent File", "GET", "files/non-existent-id", 404)

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Ziki Tunes API Tests...")
        print(f"Testing against: {self.base_url}")
        
        try:
            self.test_health_check()
            
            if self.test_auth_flow():
                self.test_files_crud()
                self.test_demo_data()
                self.test_analytics()
                self.test_wallet_operations()
                self.test_error_handling()
            else:
                print("❌ Authentication failed, skipping other tests")

        except Exception as e:
            print(f"❌ Test suite failed with error: {str(e)}")

        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed")
            return 1

def main():
    tester = ZikiTunesAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())