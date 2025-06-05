# 🚀 Job Portal - MERN Stack Application

A full-stack job portal application built with the MERN stack (MongoDB, Express, React, Node.js) that allows employers to post jobs and job seekers to find and apply for positions.

## ✅ Features Implemented

### 1️⃣ User Authentication System

- ✓ JWT-based authentication with secure HTTP-only cookies
- ✓ Role-Based Access Control (RBAC) for Employers and Job Seekers
- ✓ User registration with validation
- ✓ Login/logout functionality
- ✓ Protected routes based on user roles

### 2️⃣ Job Listings & Search

- ✓ Complete CRUD operations for job listings
- ✓ Advanced search and filtering system by category, type, and location
- ✓ Detailed job view page
- ✓ Employer-specific job management

## 🛠️ Tech Stack

### Frontend

- React with TypeScript
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- React Toastify for notifications
- Lucide React for icons

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd project
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   ```

4. Start the development server
   ```
   npm run dev
   ```

## 📁 Project Structure

```
project/
├── src/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── README.md
```

## 🔄 API Endpoints

### Authentication

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/logout` - Logout user
- `GET /api/v1/users/me` - Get current user

### Jobs

- `GET /api/v1/jobs` - Get all jobs (with filters)
- `GET /api/v1/jobs/:id` - Get job by ID
- `POST /api/v1/jobs` - Create a new job (employers only)
- `PUT /api/v1/jobs/:id` - Update job (owner only)
- `DELETE /api/v1/jobs/:id` - Delete job (owner only)
- `GET /api/v1/jobs/employer/jobs` - Get employer's jobs

## 🔮 Future Enhancements

- Job application system
- User profile management
- Resume upload and management
- Email notifications
- Admin dashboard
- Advanced search and filtering
- Company profiles
- Job recommendations

## 📝 License

This project is licensed under the MIT License.
