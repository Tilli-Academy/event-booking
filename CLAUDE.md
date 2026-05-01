# 🎉 EventBooking Platform (MERN - Production Ready)

## 📌 Overview
EventBooking is a full-stack MERN application where users can browse event services and book them online. Admins manage bookings by accepting or rejecting requests based on availability.

---

## 🧱 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Context API / Redux

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Optional Enhancements
- Redis (Caching)
- Socket.IO (Real-time updates)

---

## 🚀 Core Features

### 👤 User
- Register & Login
- Browse services
- Book an event
- Track booking status

### 🧑‍💼 Admin
- View all bookings
- Accept / Reject bookings
- Manage availability

---

## 🎯 Services Offered

- Birthday Event  
- Marriage Event  
- Pre-Wedding Shoot  
- Post-Wedding Shoot  
- Casual Party  
- Child 1st Birthday  
- Engagement Event  

---

## 🔄 Application Flow

1. User lands on Home Page  
2. Navigates to Services Page  
3. Selects a service  
4. Clicks Book Now  
5. If not logged in → Redirect to Login/Register  
6. User fills booking form (select date)  
7. Booking stored with  status  
8. Admin reviews booking  
9. Admin accepts/rejects booking  
10. User views updated status in dashboard  

---

## 🏗️ Project Structure

### Backend

```
server/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── authController.js      # Register, Login, Logout
│   ├── bookingController.js   # Create, Read, Update bookings
│   └── serviceController.js   # CRUD for event services
├── middleware/
│   ├── authMiddleware.js      # JWT token verification
│   └── adminMiddleware.js     # Admin role check
├── models/
│   ├── User.js                # User schema
│   ├── Booking.js             # Booking schema
│   └── Service.js             # Service schema
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   └── serviceRoutes.js
├── .env
├── server.js                  # Entry point
└── package.json
```

### Frontend

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── BookingForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── api/
│   │   └── axios.js           # Axios instance with base URL & interceptors
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

---

## 📦 Database Schemas

### User

| Field     | Type   | Details                          |
|-----------|--------|----------------------------------|
| name      | String | Required                         |
| email     | String | Required, Unique                 |
| password  | String | Required, Hashed (bcrypt)        |
| role      | String | Enum: `user`, `admin` (default: `user`) |
| createdAt | Date   | Auto-generated                   |

### Booking

| Field       | Type       | Details                                      |
|-------------|------------|----------------------------------------------|
| user        | ObjectId   | Ref → User                                   |
| service     | ObjectId   | Ref → Service                                |
| eventDate   | Date       | Required                                     |
| status      | String     | Enum: `pending`, `accepted`, `rejected` (default: `pending`) |
| notes       | String     | Optional user message                        |
| createdAt   | Date       | Auto-generated                               |

### Service

| Field       | Type   | Details                  |
|-------------|--------|--------------------------|
| name        | String | Required, Unique         |
| description | String | Required                 |
| image       | String | URL or file path         |
| price       | Number | Optional                 |
| createdAt   | Date   | Auto-generated           |

---

## 🔗 API Endpoints

### Auth (`/api/auth`)

| Method | Route      | Description         | Access  |
|--------|------------|---------------------|---------|
| POST   | /register  | Register a new user | Public  |
| POST   | /login     | Login & get JWT     | Public  |
| GET    | /me        | Get current user    | Private |

### Services (`/api/services`)

| Method | Route      | Description           | Access |
|--------|------------|-----------------------|--------|
| GET    | /          | Get all services      | Public |
| GET    | /:id       | Get single service    | Public |
| POST   | /          | Create a service      | Admin  |
| PUT    | /:id       | Update a service      | Admin  |
| DELETE | /:id       | Delete a service      | Admin  |

### Bookings (`/api/bookings`)

| Method | Route        | Description                 | Access  |
|--------|--------------|-----------------------------|---------|
| POST   | /            | Create a booking            | Private |
| GET    | /my          | Get logged-in user bookings | Private |
| GET    | /            | Get all bookings            | Admin   |
| PATCH  | /:id/status  | Accept or reject a booking  | Admin   |

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventbooking
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### Frontend (`client/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Setup & Development Commands

### Prerequisites
- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas URI

### Backend

```bash
cd server
npm install
npm run dev        # Start with nodemon (development)
npm start          # Start without nodemon (production)
```

### Frontend

```bash
cd client
npm install
npm run dev        # Vite dev server (default: http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🔐 Authentication Flow

1. User registers → password hashed with bcrypt → saved to MongoDB
2. User logs in → credentials verified → JWT issued (stored in httpOnly cookie or localStorage)
3. Protected routes check JWT via `authMiddleware`
4. Admin routes additionally check `role === 'admin'` via `adminMiddleware`

---

## 📝 Development Guidelines

- Follow RESTful conventions for API routes
- Use async/await with try-catch for all controller functions
- Validate request bodies using express-validator or Joi
- Return consistent JSON responses: `{ success: true/false, data/message }`
- Use HTTP status codes correctly (200, 201, 400, 401, 403, 404, 500)
- Keep business logic in controllers, not in routes
- Use `.env` for all secrets and configuration — never commit secrets
