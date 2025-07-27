# GitHub Actions Workflows

This directory contains CI/CD workflows for the User Management Application, providing comprehensive automated testing and deployment readiness checks.

## 🚀 Available Workflows

### 1. `ci.yml` - Full Test Suite (Main Workflow)
**Purpose**: Comprehensive CI pipeline that runs all tests and quality checks

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches  
- Manual workflow dispatch

**Jobs**:
1. **Code Quality** - Linting, TypeScript checks, security audits
2. **Backend Tests** - API integration tests (31 tests)
3. **Frontend Tests** - Cypress E2E tests (51 tests)
4. **Deployment Check** - Production build verification (main branch only)
5. **PR Summary** - Automated PR comments with test results

### 2. `backend-tests.yml` - Backend API Testing
**Purpose**: Focused testing of backend API endpoints

**Features**:
- Tests across Node.js 18.x and 20.x
- MySQL 8.0 service container
- Comprehensive API coverage (Authentication, CRUD, Security, Performance)
- Automatic PR comments with test results
- Test artifacts upload

### 3. `frontend-tests.yml` - Frontend E2E Testing  
**Purpose**: Cross-browser end-to-end testing

**Features**:
- Tests across Chrome, Firefox, and Edge browsers
- Full application stack (Frontend + Backend + Database)
- Video and screenshot capture on failures
- Test reports and artifacts upload

## 🏗️ Infrastructure Setup

### Services Used
- **MySQL 8.0**: Database service with health checks
- **Node.js**: Runtime environment (18.x, 20.x)
- **Ubuntu Latest**: CI environment

### Key Dependencies
- **Cypress**: Frontend E2E testing
- **Jest + Supertest**: Backend API testing
- **MySQL**: Database integration

## 📊 Test Coverage Matrix

| Test Type | Count | Coverage |
|-----------|-------|----------|
| **Backend API** | 31 tests | Health, Auth, CRUD, Security, Performance |
| **Frontend E2E** | 51 tests | Login, Registration, Dashboard, User Management |
| **Code Quality** | Various | Linting, TypeScript, Security audits |
| **Total** | **82+ checks** | **Full application coverage** |

## 🔧 Workflow Features

### Automated Testing
- ✅ **Parallel execution** for faster feedback
- ✅ **Matrix builds** across multiple environments
- ✅ **Dependency caching** for improved performance
- ✅ **Health checks** for all services
- ✅ **Retry logic** for flaky tests

### Reporting & Artifacts
- 📊 **Automatic PR comments** with detailed results
- 📸 **Screenshot/video capture** on test failures
- 📈 **Test coverage reports** 
- 🗂️ **Artifact uploads** (7-day retention)

### Quality Gates
- 🚨 **Security audits** (npm audit)
- 🔍 **Code linting** (ESLint)
- 📝 **TypeScript checks**
- 🏗️ **Production build validation**

## 🛠️ Configuration

### Environment Variables
```yaml
NODE_ENV: test
CI: true
CYPRESS_baseUrl: http://localhost:3000
MYSQL_ROOT_PASSWORD: ''
MYSQL_ALLOW_EMPTY_PASSWORD: yes
```

### Service Configuration
```yaml
MySQL:
  Image: mysql:8.0
  Port: 3306
  Health Check: mysqladmin ping
  Database: user_management
```

## 📋 Prerequisites

### Repository Setup
1. **Secrets**: No additional secrets required
2. **Permissions**: Standard GitHub Actions permissions
3. **Branches**: Workflows target `main` and `develop` branches

### Code Requirements
- **Backend**: `package.json` with `start` script
- **Frontend**: `package.json` with `start` and `build` scripts
- **Tests**: Properly configured test suites

## 🚦 Workflow Status Indicators

### Success Criteria
- ✅ All code quality checks pass
- ✅ All 31 backend API tests pass
- ✅ All 51 frontend E2E tests pass
- ✅ Production build succeeds (main branch)

### Failure Scenarios
- ❌ Linting or TypeScript errors
- ❌ Security vulnerabilities found
- ❌ API test failures
- ❌ E2E test failures
- ❌ Production build failures

## 📱 PR Integration

### Automatic Comments
Each PR receives detailed status comments including:
- Overall test results summary
- Individual test suite status
- Test coverage breakdown
- Ready-to-merge indicators
- Failure investigation links

### Branch Protection
Recommended branch protection rules:
```yaml
main:
  - Require status checks: "CI - Full Test Suite"
  - Require up-to-date branches
  - Require review from code owners
```

## 🔄 Workflow Optimization

### Performance Features
- **Dependency caching**: npm packages cached across runs
- **Parallel jobs**: Tests run simultaneously when possible  
- **Selective triggers**: Only run when relevant files change
- **Service health checks**: Ensure dependencies are ready

### Resource Management
- **Artifact retention**: 7 days (configurable)
- **Timeout limits**: Reasonable timeouts prevent hanging
- **Resource cleanup**: Automatic cleanup after tests

## 🐛 Troubleshooting

### Common Issues

#### MySQL Connection Failures
```bash
# Check service health
mysqladmin ping -h 127.0.0.1 -P 3306 --silent

# Verify database creation
mysql -h 127.0.0.1 -P 3306 -u root -e "SHOW DATABASES;"
```

#### Frontend Build Issues
```bash
# Check for environment conflicts
CI: false  # Prevents treating warnings as errors
BROWSER: none  # Prevents browser opening in CI
```

#### Test Timeouts
```yaml
# Adjust timeouts in workflow files
wait-on-timeout: 120  # Cypress timeout
timeout-minutes: 30   # Job timeout
```

### Debug Information
- **Workflow logs**: Available in GitHub Actions tab
- **Artifacts**: Screenshots, videos, and reports
- **PR comments**: Detailed failure information

## 📈 Future Enhancements

### Planned Improvements
- **Performance testing**: Load testing integration
- **Visual regression**: Screenshot comparison tests
- **Mobile testing**: Cross-device compatibility
- **Accessibility testing**: WCAG compliance checks

### Integration Options
- **Slack notifications**: Test result notifications
- **Code coverage**: Coverage reporting integration
- **Deployment**: Automatic deployment on successful tests

---

**Last Updated**: December 2024  
**Workflow Version**: v1.0  
**GitHub Actions**: Latest stable versions 