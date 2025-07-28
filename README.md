# User Management Application 🚀

A modern, full-stack user management system built with **React** and **Node.js**, featuring comprehensive authentication, user CRUD operations, and admin functionality with **complete testing coverage**.

## ✨ Features

- 🔐 **User Authentication**: Secure login and registration with JWT tokens
- 👨‍💼 **Admin Dashboard**: Modern admin interface with user management
- 📊 **User Management**: Complete CRUD operations for user data
- 🛡️ **Role-based Access**: Admin and regular user permissions
- 📱 **Responsive Design**: Beautiful UI with Tailwind CSS
- 🔒 **Security**: Password hashing, input validation, XSS protection
- 🧪 **100% Test Coverage**: Comprehensive E2E and API testing
- 🚀 **CI/CD Pipeline**: Automated testing with GitHub Actions

## 🏗️ Architecture

```
User Management App/
├── backend/              ← Node.js API (Express + MySQL)
│   ├── server.js         ← Main server file
│   ├── package.json      ← Backend dependencies
│   └── users.db          ← SQLite database file
│
├── frontend/             ← React App (Modern UI)
│   ├── src/
│   │   ├── pages/        ← Login, Register, Dashboard
│   │   └── components/   ← Reusable UI components
│   ├── public/           ← Static assets
│   └── package.json      ← Frontend dependencies
│
├── tests/                ← API Testing Suite
│   ├── api.test.js       ← Complete API test coverage
│   └── package.json      ← Test dependencies
│
├── cypress/              ← E2E UI Testing
│   └── e2e/
│       ├── login.cy.js
│       ├── register.cy.js
│       └── dashboard.cy.js
│
├── .github/workflows/    ← CI/CD Automation
│   ├── backend-tests.yml
│   ├── frontend-tests.yml
│   └── ci.yml
│
├── README.md             ← This file
├── test-plan.md          ← Testing strategy
└── TESTING_DOCUMENTATION.md ← Test documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **MySQL 8.0+** (or XAMPP for easy setup)
- **Git**

### 1️⃣ Clone & Install
```bash
git clone <repository-url>
cd user-management-app

# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../tests && npm install
```

### 2️⃣ Database Setup
```bash
# Start MySQL (via XAMPP or service)
# Create database: user_management
# Tables will be created automatically
```

### 3️⃣ Start Application
```bash
# Terminal 1: Start Backend
cd backend
npm start  # Runs on http://localhost:5000

# Terminal 2: Start Frontend  
cd frontend
npm start  # Runs on http://localhost:3000
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Default Admin**: `admin@admin.com` / `admin123`

## 🧪 Testing

### Frontend E2E Testing (Cypress)
```bash
cd frontend
npx cypress open    # Interactive mode
npx cypress run     # Headless mode
```

### Backend API Testing (Jest + Supertest)
```bash
cd tests
npm test           # Run all API tests
npm run test:watch # Watch mode
npm run test:coverage # With coverage
```

### Test Coverage
- **📊 Total Tests**: 82 tests (51 UI + 31 API)
- **✅ Pass Rate**: 100%
- **🎯 Coverage**: Authentication, CRUD, Security, Error Handling
- **⚡ Execution Time**: ~15 seconds

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Cypress** for E2E testing

### Backend
- **Node.js** with Express
- **MySQL** database
- **JWT** authentication
- **bcrypt** password hashing
- **Jest + Supertest** for testing

### DevOps
- **GitHub Actions** for CI/CD
- **Cross-browser testing**
- **Automated deployment checks**

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/health` - Health check

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ SQL injection prevention

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows
- **Backend Tests**: API testing across Node.js versions
- **Frontend Tests**: E2E testing across browsers
- **Combined CI**: Full test suite with quality checks
- **Deployment**: Automated deployment verification

### Features
- 🔄 **Parallel execution** for faster feedback
- 🌐 **Cross-browser testing** (Chrome, Firefox, Edge)
- 📊 **Automatic PR comments** with test results
- 📸 **Screenshot/video capture** on failures
- 🔍 **Security audits** and dependency checks

## 📚 Documentation

- **[Test Plan](test-plan.md)** - Complete testing strategy
- **[Testing Documentation](TESTING_DOCUMENTATION.md)** - Detailed test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test:all`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- Comprehensive testing approach with Cypress and Jest
- Professional CI/CD pipeline with GitHub Actions
- Security-first development approach

---

**Status**: ✅ Production Ready  
**Test Coverage**: 82 tests passing  
**Last Updated**: December 2024 