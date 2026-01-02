# 🏬 MallBook - Shopping Mall Booking System

A modern full-stack application for booking services and exploring stores in shopping malls. Built with **React.js** frontend and **Node.js** backend.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/register
- 🏪 **Store Directory** - Browse stores by floor and category
- 📅 **Easy Booking** - Simple booking process with confirmation
- 📊 **Admin Dashboard** - Real-time statistics and management
- 🎨 **Modern UI** - Responsive design with animations

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Framer Motion, Axios, React Query

**Backend:** Node.js, Express, MongoDB, JWT Authentication, bcryptjs

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mallbook.git
cd mallbook

# Install all dependencies
npm run install:all
```

## ▶️ Running the Application

**Development:**
```bash
npm run dev              # Start both frontend and backend
npm run server:dev       # Backend only on http://localhost:5000
npm run client:dev       # Frontend only on http://localhost:3000
```

**Production:**
```bash
npm run client:build     # Build frontend
npm run server:start     # Start backend
```

## ⚙️ Environment Variables

Create `.env` file in root directory:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/mallbook
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE=http://localhost:5000/api
```

## 📊 Database Seeding

```bash
npm run seed
```

Creates sample data: Admin user, 20+ stores across 3 floors, and services.

## 📁 Project Structure

```
mallbook/
├── backend/
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & errors
│   └── server.js         # Main server
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # State management
│   │   └── utils/        # Utilities
│   └── public/           # Static assets
└── package.json
```

## 🔗 Main API Endpoints

**Auth:** POST `/auth/register`, POST `/auth/login`, GET `/auth/user`

**Stores:** GET `/stores`, GET `/stores/floors`, GET `/stores/categories`

**Services:** GET `/services`, GET `/services/:id`

**Bookings:** POST `/bookings`, GET `/bookings`, PUT `/bookings/:id/cancel`

**Admin:** GET `/admin/dashboard`

## 👥 User Roles

- **Customer** - Browse and book services
- **Admin** - Full system access
- **Store Manager** - Manage services

## 🌐 Deployment

**Frontend:** Vercel (auto-deploy with `vercel.json`)

**Backend:** Heroku, Railway, or Render

## 📄 License

MIT License

## 👤 Author

Saurabh Chaurasia

---

**Status:** **Version:** 1.0.0 | **Last Updated:** January 2026
