# E-Shop Nepal - Full Stack MERN E-Commerce Application

A complete, production-ready e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring Khalti ePayment integration and Cash on Delivery.

## Features

### User Features
- User registration and login with JWT authentication
- Browse and search products with filters and sorting
- Product details with related products and ratings
- Shopping cart with persistent storage
- Multi-step checkout flow
- Cash on Delivery (COD) payment
- Khalti online payment integration
- Order history and tracking
- Profile management

### Admin Features
- Dashboard with sales statistics
- Full CRUD for products, categories, and users
- Order management with status updates
- Payment status management
- User role management
- Search and pagination across all resources

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens), bcrypt |
| State Management | React Context API |
| HTTP Client | Axios |
| Payments | Khalti ePayment Gateway, Cash on Delivery |

## Project Structure

```
ecommerce/
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   └── admin/       # Admin dashboard pages
│   │   ├── layouts/         # Layout components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Root component with routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── services/            # External service integrations
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce
```

### 2. Server Setup

```bash
cd server
npm install
```

### 3. Client Setup

```bash
cd ../client
npm install
```

### 4. Environment Variables

Copy the example env file and configure it:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_BASE_URL=https://dev.khalti.com/api/v2
KHALTI_RETURN_URL=http://localhost:5173/payment/khalti/verify
WEBSITE_URL=http://localhost:5173
```

### 5. Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

Or use a MongoDB Atlas connection string in `MONGODB_URI`.

### 6. Run the Application

**Start the backend:**

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`

**Start the frontend:**

```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173`

The Vite dev server proxies API requests to the backend automatically.

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Products (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (search, filter, paginate) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/:id/related` | Get related products |

### Categories (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |

### Orders (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (COD) |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |

### Payments (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/khalti/initiate` | Initiate Khalti payment |
| POST | `/api/payments/khalti/verify` | Verify Khalti payment |

### Admin APIs (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET/POST | `/api/admin/products` | List/Create products |
| PUT/DELETE | `/api/admin/products/:id` | Update/Delete product |
| POST | `/api/admin/categories` | Create category |
| PUT/DELETE | `/api/admin/categories/:id` | Update/Delete category |
| GET | `/api/admin/orders` | Get all orders |
| GET | `/api/admin/orders/:id` | Get order details |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| PUT | `/api/admin/orders/:id/payment-status` | Update payment status |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## Admin Setup

To create an admin user, register a new account and then manually update the role in MongoDB:

```javascript
// In MongoDB shell
use ecommerce
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Khalti Sandbox Setup

### Getting Sandbox Credentials

1. Visit [Khalti Developer Dashboard](https://dev.khalti.com/)
2. Create an account and get your test secret key
3. Add the key to your `.env` file

### Test Credentials for Sandbox

```
Test Khalti IDs: 9800000000, 9800000001, 9800000002, 9800000003, 9800000004, 9800000005
Test MPIN: 1111
Test OTP: 987654
```

### Sandbox Configuration

```env
KHALTI_BASE_URL=https://dev.khalti.com/api/v2
```

### Production Configuration

```env
KHALTI_BASE_URL=https://khalti.com/api/v2
KHALTI_SECRET_KEY=your_production_secret_key
```

## Payment Flow

### Cash on Delivery (COD)

1. User selects COD at checkout
2. Order is created with `paymentStatus: "Pending"`
3. Stock is reduced
4. Admin updates status after delivery

### Khalti Payment

1. User selects Khalti at checkout
2. Frontend sends request to `/api/payments/khalti/initiate`
3. Backend validates products, creates pending order, calls Khalti API
4. Khalti returns `pidx` and `payment_url`
5. User is redirected to Khalti payment page
6. After payment, Khalti redirects to return URL
7. Frontend sends `pidx` to `/api/payments/khalti/verify`
8. Backend verifies with Khalti and updates order

## Security Considerations

- JWT-based authentication with secure token storage
- bcrypt password hashing (salt rounds: 10)
- Role-based authorization middleware
- Khalti secret key never exposed to frontend
- Server-side price validation (never trust frontend prices)
- CORS configured for specific origin
- Rate limiting on API endpoints
- Helmet.js for secure HTTP headers
- MongoDB injection protection via Mongoose
- Centralized error handling
- Idempotent payment verification

## Folder Structure Details

### Server Models

- **User** - Authentication and profile data
- **Product** - Product catalog with categories, pricing, stock
- **Category** - Product categories with slugs
- **Order** - Orders with items, shipping, payment info

### Server Middleware

- `authenticateUser` - JWT token verification
- `authorizeRoles` - Role-based access control
- `errorHandler` - Centralized error handling

### Frontend Context

- `AuthContext` - User authentication state
- `CartContext` - Shopping cart with localStorage persistence
- `ToastContext` - Toast notification provider

## License

MIT
