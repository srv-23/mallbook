# MallBook - Shopping Mall Booking System

A modern web application for booking services and stores in shopping malls. Built with React.js frontend and Node.js backend.

## Features

- **User Authentication**: Secure login and registration system
- **Store Management**: Browse and view store details
- **Service Booking**: Book services from different stores
- **Admin Dashboard**: Manage stores, services, and bookings
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Real-time Updates**: Live booking status updates

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- React Icons for icons
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the application**
   ```bash
   # Start the server (from root directory)
   npm start
   
   # Start the client (in a new terminal, from client directory)
   cd client
   npm start
   ```

## Project Structure

```
project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── server.js              # Express server
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (admin only)
- `PUT /api/stores/:id` - Update store (admin only)
- `DELETE /api/stores/:id` - Delete store (admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Saurabh Chaurasia** - [@srv-23](https://github.com/srv-23)

- **4th Year Information Technology Engineering** student at Netaji Subhash University of Technology, New Delhi
- **LinkedIn**: [saurabh-chaurasia-634683263](https://linkedin.com/in/saurabh-chaurasia-634683263)
- **Tech Stack**: JavaScript, TypeScript, Python, React, Node.js, C++, TailwindCSS, SQL, PostgreSQL, MongoDB, Docker

## Contact

- **GitHub**: [@srv-23](https://github.com/srv-23)
- **LinkedIn**: [Saurabh Chaurasia](https://linkedin.com/in/saurabh-chaurasia-634683263)
- **Location**: New Delhi, India

Project Link: [https://github.com/srv-23/mallbook](https://github.com/srv-23/mallbook) 