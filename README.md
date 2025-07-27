# User Management App

A full-stack user management application built with React and Node.js.

## Project Structure

```
User Management App/
├── frontend/          # React application
├── backend/           # Node.js server
├── package.json       # Root package.json with scripts
└── README.md          # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Run the development servers:
```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

### Individual Commands

- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`
- **Build frontend**: `npm run build`
- **Start production**: `npm start`

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000 (to be configured)

## Next Steps

1. Set up the React application in the `frontend/` directory
2. Set up the Node.js server in the `backend/` directory
3. Configure database connection
4. Implement user management features 