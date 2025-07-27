# Backend API Server

Node.js backend server for the User Management Application.

## Features

- Express.js REST API
- SQLite database with user management
- JWT authentication
- Password hashing with bcrypt
- CORS enabled for frontend communication

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Users (Protected Routes)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

Create a `.env` file with:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## Installation & Running

```bash
cd backend
npm install
npm run dev  # Development with nodemon
npm start    # Production
``` 