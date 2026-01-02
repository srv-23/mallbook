# 🏬 MallBook - Shopping Mall Booking System

> A modern full-stack web application for discovering, booking services, and managing shopping mall reservations. Built with cutting-edge technologies for a seamless user experience.

**Version:** 1.0.0 | **Last Updated:** January 2026

---

## 🎯 Overview

MallBook is a comprehensive booking management system designed for shopping malls. It enables:

- **Customers** to discover stores, browse services, and make bookings across multiple mall locations
- **Admins** to manage stores, services, bookings, and view real-time analytics
- **Store Managers** to handle service listings and booking requests

The application features a responsive, modern UI with smooth animations, real-time updates, and a robust backend API supporting millions of requests.

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure token-based user sessions
- **Password Hashing** - bcryptjs for secure password storage
- **Protected Routes** - Role-based access control throughout the app
- **Session Management** - Automatic token refresh and expiration

### 🏪 Store & Service Management
- **Browse Stores** - Explore stores organized by floors (Ground, First, Second)
- **Floor-Based Navigation** - Easy filtering and discovery
- **Service Catalog** - Detailed service listings with pricing in INR
- **Real-time Availability** - Up-to-date store and service information

### 📅 Booking System
- **Intuitive Booking Interface** - Simple, step-by-step booking process
- **Booking Confirmation** - Instant confirmation with booking reference
- **Booking History** - View all past and upcoming bookings
- **Booking Cancellation** - Cancel bookings with one click

### 📊 Admin Dashboard
- **Real-time Analytics** - View booking statistics and trends
- **Revenue Tracking** - Monitor earnings across stores
- **Booking Management** - Comprehensive booking administration
- **User Management** - Manage customers and store managers

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion for fluid, polished interactions
- **Modern UI Components** - Glassmorphism effects and gradient styling
- **Loading States** - Smooth loading indicators and skeleton screens

### 🔔 Additional Features
- **Rate Limiting** - Protect API from abuse
- **Error Handling** - Comprehensive error messages and recovery
- **Data Validation** - Both client and server-side validation
- **Search & Filter** - Advanced filtering by floor, category, price

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components (Auth, Stores, Services, Bookings) │  │
│  │  State Management (React Context API)                │  │
│  │  Styling (Tailwind CSS + Custom Global CSS)          │  │
│  │  Animations (Framer Motion)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  SERVER (Express.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (Auth, Stores, Services, Bookings, Admin)   │  │
│  │  Middleware (JWT Auth, Error Handler, Rate Limit)   │  │
│  │  Business Logic Controllers                          │  │
│  │  Data Validation & Security                          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  DATABASE (MongoDB)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users Collection     (Authentication)               │  │
│  │  Stores Collection    (Store Information)            │  │
│  │  Services Collection  (Service Listings)             │  │
│  │  Bookings Collection  (Booking Records)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI library for building components | 18.x |
| **React Router** | Client-side routing and navigation | 6.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.x |
| **Framer Motion** | Animation and motion library | 10.x |
| **Axios** | HTTP client for API requests | 1.x |
| **React Query** | Data fetching and caching | 3.x |
| **React Icons** | Icon library (FontAwesome) | 6.x |
| **Recharts** | Charting library for analytics | Latest |
| **React Toastify** | Toast notifications | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | JavaScript runtime | 16.x+ |
| **Express** | Web framework | 4.x |
| **MongoDB** | NoSQL database | Latest |
| **Mongoose** | MongoDB object modeling | 7.x |
| **JWT** | Authentication tokens | Latest |
| **bcryptjs** | Password hashing | 2.x |
| **CORS** | Cross-origin resource sharing | Latest |
| **Dotenv** | Environment variable management | Latest |

### Development Tools

- **npm** - Package manager
- **Git** - Version control
- **Vercel** - Frontend deployment
- **Heroku/Railway/Render** - Backend deployment

---

## 📁 Project Structure

```
mallbook/
│
├── backend/                          # Express.js API Server
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   ├── errorHandler.js          # Global error handling
│   │   └── rateLimit.js             # API rate limiting
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (customers, admins)
│   │   ├── Store.js                 # Store schema with floor info
│   │   ├── Service.js               # Service schema for stores
│   │   └── Booking.js               # Booking schema with references
│   │
│   ├── routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── stores.js                # Store management endpoints
│   │   ├── services.js              # Service endpoints
│   │   ├── bookings.js              # Booking endpoints
│   │   ├── users.js                 # User management endpoints
│   │   └── admin.js                 # Admin dashboard endpoints
│   │
│   ├── server.js                    # Main server entry point
│   ├── seed.js                      # Database seeding script
│   └── package.json                 # Backend dependencies
│
├── frontend/                         # React.js Application
│   ├── public/
│   │   └── index.html               # HTML entry point
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.js       # Admin analytics dashboard
│   │   │   ├── auth/
│   │   │   │   ├── Login.js                # Login component
│   │   │   │   └── Register.js             # Registration component
│   │   │   ├── bookings/
│   │   │   │   ├── BookingForm.js          # Booking creation form
│   │   │   │   └── MyBookings.js           # User bookings history
│   │   │   ├── common/
│   │   │   │   └── LoadingSpinner.js       # Loading indicator
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.js            # User dashboard
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js               # Navigation bar
│   │   │   │   └── Footer.js               # Footer component
│   │   │   ├── pages/
│   │   │   │   └── Home.js                 # Landing page
│   │   │   ├── services/
│   │   │   │   ├── Services.js             # Services listing
│   │   │   │   └── ServiceDetail.js        # Service details
│   │   │   └── stores/
│   │   │       ├── Stores.js               # Stores listing with filters
│   │   │       └── StoreDetail.js          # Store details page
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.js              # Authentication state
│   │   │
│   │   ├── utils/
│   │   │   └── currency.js                 # Currency formatting utilities
│   │   │
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles & utilities
│   │
│   └── package.json                 # Frontend dependencies
│
├── package.json                      # Root scripts for both projects
├── vercel.json                       # Vercel deployment config
└── README.md                         # Project documentation
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer|admin|manager),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Stores Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  floor: Number (0=Ground, 1=First, 2=Second),
  category: String,
  image: String (URL),
  rating: Number,
  location: String,
  contactPhone: String,
  isOpen: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Services Collection
```javascript
{
  _id: ObjectId,
  storeId: ObjectId (ref: Store),
  name: String,
  description: String,
  price: Number (in INR),
  duration: Number (in minutes),
  maxCapacity: Number,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  storeId: ObjectId (ref: Store),
  serviceId: ObjectId (ref: Service),
  bookingDate: Date,
  bookingTime: String,
  guests: Number,
  totalPrice: Number,
  status: String (pending|confirmed|cancelled),
  bookingReference: String,
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud - MongoDB Atlas)
- **Git** for version control
- Basic understanding of REST APIs

### Environment Setup
1. Node.js: https://nodejs.org/
2. MongoDB: https://www.mongodb.com/
3. Git: https://git-scm.com/

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/srv-23/mallbook.git
cd mallbook
```

### 2. Install Dependencies
```bash
# Install all dependencies for both frontend and backend
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Backend Configuration
MONGODB_URI=mongodb://localhost:27017/mallbook
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mallbook

JWT_SECRET=your_jwt_secret_key_here_make_it_strong
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Development Mode (Recommended)

**Start Both Frontend and Backend:**
```bash
npm run dev
```

**Or Start Separately:**
```bash
# Terminal 1 - Backend (runs on http://localhost:5000)
npm run server:dev

# Terminal 2 - Frontend (runs on http://localhost:3000)
npm run client:dev
```

### Production Mode

**Build Frontend:**
```bash
npm run client:build
```

**Start Backend Server:**
```bash
npm run server:start
```

---

##  User Roles & Permissions

### 1. Customer
- ✅ Register and login
- ✅ Browse stores and services
- ✅ Create bookings
- ✅ View own bookings
- ✅ Cancel bookings
- ✅ Update profile
- ❌ Cannot access admin features

### 2. Admin
- ✅ All customer features
- ✅ View analytics dashboard
- ✅ Manage all stores
- ✅ Manage all services
- ✅ View all bookings
- ✅ Manage all users
- ✅ Update booking status

### 3. Store Manager
- ✅ All customer features
- ✅ Manage assigned store
- ✅ Add/edit services
- ✅ View store-specific bookings
- ✅ Manage store information

---

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<strong_secret_key>
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend (Environment Variables)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE=http://localhost:5000/api
```

### Vercel Deployment Configuration

The `vercel.json` file handles deployment settings:
- Frontend deploys on Vercel
- Backend can be deployed on separate platform (Heroku, Railway, Render)

---

## 📊 Database Seeding

### Seed Data Included

**Stores (20 total):**
- 7 stores on Ground Floor (Floor 0)
- 6 stores on First Floor (Floor 1)
- 7 stores on Second Floor (Floor 2)

**Services:**
- 4-5 services per store
- Realistic Indian mall pricing (₹0 - ₹99,999)
- Diverse categories (Fashion, Food, Entertainment, Healthcare)

**Sample Admin Account:**
```
Email: admin@mall.com
Password: admin123
```

### Run Seeding

```bash
npm run seed
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

The project includes `vercel.json` configuration:

```bash
# Automatic deployment
git push origin main
```

Vercel will automatically:
- Build the React application
- Optimize static assets
- Deploy to Vercel CDN

**Frontend URL:** `https://your-project-name.vercel.app`

### Backend Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

#### Option 2: Railway
- Connect GitHub repository
- Select backend folder
- Provide environment variables
- Auto-deploy on push

#### Option 3: Render
- Connect GitHub repository
- Create new Web Service
- Deploy backend code

### Environment Variables on Production

Set these on your deployment platform:
```
MONGODB_URI=<production_mongodb_atlas_url>
JWT_SECRET=<strong_production_secret>
NODE_ENV=production
CLIENT_URL=<your_vercel_url>
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### 1. Fork Repository
```bash
git clone https://github.com/yourusername/mallbook.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/YourFeatureName
```

### 3. Commit Changes
```bash
git add .
git commit -m "Add: Brief description of changes"
```

### 4. Push to Branch
```bash
git push origin feature/YourFeatureName
```

### 5. Open Pull Request
- Describe your changes
- Reference any related issues
- Ensure all tests pass

### Code Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 📄 License

MIT License - Free to use and modify

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

---

## 👤 Author

**Saurabh Chaurasia**

- GitHub: [@srv-23](https://github.com/srv-23)
- Project: [MallBook](https://github.com/srv-23/mallbook)

---

## 📞 Support & Issues

Found a bug or have a suggestion? Let us know!

- 🐛 **Report Issues:** [GitHub Issues](https://github.com/srv-23/mallbook/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/srv-23/mallbook/discussions)

---

## 🎯 Project Highlights

✅ **Modern Architecture** - Clean separation of concerns with backend/frontend structure  
✅ **Responsive Design** - Works perfectly on all devices  
✅ **Secure Authentication** - JWT-based with bcryptjs password hashing  
✅ **Real-time Analytics** - Admin dashboard with live statistics  
✅ **Scalable Database** - MongoDB for flexible data modeling  
✅ **Secure & Stable** - Error handling, validation, and rate limiting  
✅ **Easy Deployment** - Vercel for frontend, multiple options for backend  
✅ **Well Documented** - Comprehensive API documentation and setup guides  

---

## 🚀 Future Enhancements

- [ ] Email notifications for bookings
- [ ] SMS confirmations
- [ ] Payment gateway integration
- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Rating and review system

---

**Built with ❤️ by Saurabh Chaurasia**  
**Version:** 1.0.0 | **Last Updated:** January 2026
