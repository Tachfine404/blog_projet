# MERN Stack Blog Project

A full-featured blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Register/Login)
- User Roles (Admin/User)
- Blog Post Management
- Comment System
- Category Management
- User Profiles with Avatar
- Admin Dashboard
- Responsive Design

## Project Structure

```
├── frontend/           # React frontend application
└── backend/           # Node.js & Express backend API
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```

## Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend `.env`:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```
