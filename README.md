# 📝 Full-Stack Note-Taking Application

A modern, responsive note-taking application built with React (TypeScript) frontend and Node.js backend, featuring user authentication, note management, and mobile-friendly design.

## 🚀 Features

- **User Authentication**
  - Email/OTP signup and login
  - JWT-based authorization
  - Secure password handling

- **Note Management**
  - Create, read, update, and delete notes
  - Rich text editing capabilities
  - Note categorization and search
  - Real-time updates

- **User Experience**
  - Responsive design for all devices
  - Modern, intuitive interface
  - Welcome page with user information
  - Error handling and validation

## 🛠️ Technology Stack (MERN + TypeScript)

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **JWT** for authentication
- **bcrypt** for password hashing
- **cors** for cross-origin requests
- **helmet** for security headers

### Database
- **MongoDB** with Mongoose ODM

### Authentication
- **JWT tokens**
- **OTP verification** via email

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **MongoDB** (v6.0 or higher)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd note-taking-app
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/note-taking-app
MONGODB_URI_PROD=your-production-mongodb-uri

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d


# Email Configuration (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Note Taking App
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

#### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   # Start MongoDB service
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas (Cloud):**
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in your `.env` file

### 5. Google OAuth Setup (Not Required)

This project does not include Google OAuth integration. Authentication is handled through email/OTP flow only.

### 6. Email Setup (for OTP)

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate App Password
   - Use App Password in SMTP_PASS

2. **Other SMTP Providers:**
   - Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS accordingly

## 🏃‍♂️ Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```
## 📱 Application Structure

```
note-taking-app/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── app.ts          # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── tsconfig.json
├── docs/                    # Documentation
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## 🚀 Deployment

### Backend Deployment (Heroku)

1. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-production-mongodb-uri
   heroku config:set JWT_SECRET=your-production-jwt-secret
   # ... other environment variables
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

### Docker Deployment

1. **Build Images:**
   ```bash
   docker-compose build
   ```

2. **Run Services:**
   ```bash
   docker-compose up -d
   ```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Environment variable protection

## 📱 Mobile Responsiveness

The application is built with mobile-first design principles:
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for various screen sizes
- Progressive Web App (PWA) features

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB service is running
   - Check connection string in `.env`
   - Verify network access for cloud databases

2. **OTP Verification Error:**
   - Check SMTP configuration
   - Verify email credentials
   - Ensure proper email service setup

3. **JWT Token Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure proper token format

4. **CORS Errors:**
   - Verify FRONTEND_URL in backend `.env`
   - Check CORS configuration
   - Ensure proper origin settings

---

**Last Updated:** August 2025  
**Version:** 1.0.0  