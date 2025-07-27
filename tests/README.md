# API Integration Tests

This directory contains comprehensive API integration tests for the User Management App backend.

## 🧪 Test Coverage

### **Authentication & Registration**
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Invalid credentials handling
- ✅ Duplicate email prevention

### **User Management (CRUD)**
- ✅ Get all users (protected route)
- ✅ Get single user by ID
- ✅ Update user information
- ✅ Delete user
- ✅ Authentication middleware

### **Security & Validation**
- ✅ JWT token validation
- ✅ Authorization checks
- ✅ Input sanitization (XSS prevention)
- ✅ Email format validation
- ✅ Password strength checks

### **Error Handling**
- ✅ 404 errors for non-existent resources
- ✅ 401 unauthorized access
- ✅ 400 malformed requests
- ✅ Invalid JSON handling

### **Performance & Security**
- ✅ CORS headers
- ✅ Response time testing
- ✅ Concurrent request handling
- ✅ Security headers validation

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd tests
npm install
```

### 2. Ensure Backend is Available
Make sure your backend server is configured to run on `http://localhost:5000` or update the `API_BASE_URL` in the test file.

The tests will automatically start/stop the server, but you need the backend code available.

## 🏃‍♂️ Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Tests with Verbose Output
```bash
npm run test:verbose
```

### Run Specific Test Suites
```bash
# Run only authentication tests
npx jest --testNamePattern="User Authentication"

# Run only user management tests
npx jest --testNamePattern="User Management"

# Run only security tests
npx jest --testNamePattern="Security"
```

## 📊 Test Structure

```
tests/
├── api.test.js           # Main API integration tests
├── package.json          # Test dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables
The tests use these default configurations:
- **API_BASE_URL**: `http://localhost:5000`
- **TEST_TIMEOUT**: `30000ms` (30 seconds)
- **NODE_ENV**: `test` (set automatically)

### Test Database
The tests will use your backend's database. Make sure you have a test database or the tests may affect your development data.

### Admin Credentials
Tests expect these default admin credentials:
- **Email**: `admin@admin.com`
- **Password**: `admin123`

## 📋 Test Data Flow

1. **Health Check** - Verifies server is running
2. **User Registration** - Creates test user
3. **Authentication** - Gets admin token for protected routes
4. **User Management** - Tests CRUD operations
5. **Cleanup** - Deletes test user
6. **Error Scenarios** - Tests various error conditions

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check if port 5000 is already in use
lsof -i :5000

# Kill existing process if needed
kill -9 <PID>
```

**Tests timing out:**
- Increase timeout in `jest.config.js`
- Check if backend server is responding
- Verify database connection

**Authentication failures:**
- Verify admin credentials exist in database
- Check JWT secret configuration
- Ensure token format is correct

**Database errors:**
- Verify database is accessible
- Check if test data conflicts with existing data
- Consider using a separate test database

### Debug Mode

Run tests with debug output:
```bash
DEBUG=* npm test
```

Or with Jest's debug mode:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📈 Adding New Tests

### Test Structure Example
```javascript
describe('New Feature', () => {
  it('should do something specific', async () => {
    const response = await api.post('/api/new-endpoint', testData, adminToken);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

### Best Practices
- ✅ Use descriptive test names
- ✅ Test both success and failure scenarios
- ✅ Clean up test data
- ✅ Use proper HTTP status codes
- ✅ Validate response structure
- ✅ Test authentication/authorization
- ✅ Include edge cases

## 🔐 Security Testing

The tests include security validations for:
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Input Validation**: Prevents malicious input
- **XSS Prevention**: Sanitizes user content
- **CORS**: Cross-origin request handling

## 📞 Support

If you encounter issues with the tests:
1. Check the troubleshooting section above
2. Verify your backend setup matches the expected API
3. Review test output for specific error messages
4. Ensure all dependencies are installed correctly

## 🚀 CI/CD Integration

To run these tests in CI/CD:

```yaml
# Example GitHub Actions
- name: Run API Tests
  run: |
    cd tests
    npm install
    npm test
```

Make sure your CI environment has:
- Node.js installed
- Backend dependencies available
- Database accessible
- Proper environment variables set 