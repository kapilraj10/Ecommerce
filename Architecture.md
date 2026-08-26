# Architecture

## System Architecture

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce application with a client-server architecture.

## High-Level Architecture

```
┌─────────────────────────────────┐
│         React Frontend          │
│   (Vite + Tailwind CSS)        │
│   Port: 5173                   │
│                                 │
│   Context API (State Mgmt)     │
│   Axios (HTTP Client)          │
│   React Router v6 (Routing)    │
└────────────┬────────────────────┘
             │ REST API (JSON)
             │ /api/*
┌────────────▼────────────────────┐
│       Express.js Backend        │
│   Port: 5000                   │
│                                 │
│   Middleware Layer              │
│   ├── JWT Auth                 │
│   ├── Role-Based Access        │
│   ├── Rate Limiting            │
│   ├── Helmet (Security)        │
│   └── Error Handler            │
│                                 │
│   Controller Layer             │
│   ├── Auth Controller          │
│   ├── Product Controller       │
│   ├── Category Controller      │
│   ├── Order Controller         │
│   ├── Payment Controller       │
│   └── Admin Controller         │
│                                 │
│   Service Layer                │
│   └── Khalti Payment Service   │
│                                 │
│   Model Layer (Mongoose)       │
│   ├── User Model               │
│   ├── Product Model            │
│   ├── Category Model           │
│   └── Order Model              │
└────────────┬────────────────────┘
             │ Mongoose ODM
┌────────────▼────────────────────┐
│         MongoDB                │
│   Database: ecommerce          │
│   Port: 27017                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│     Khalti Payment Gateway      │
│   Sandbox / Production API     │
└─────────────────────────────────┘
```

## Directory Structure

```
New Folder/
├── client/                       # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Footer.jsx        # Site footer
│   │   │   ├── ProductCard.jsx   # Product display card
│   │   │   ├── Pagination.jsx    # Page navigation
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── pages/                # Route-level components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MyOrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── PaymentSuccessPage.jsx
│   │   │   ├── PaymentFailedPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminCreateProduct.jsx
│   │   │       ├── AdminEditProduct.jsx
│   │   │       ├── AdminCategories.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminOrderDetail.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── layouts/              # Page layouts
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── context/              # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── services/             # API communication
│   │   │   ├── api.js            # Axios instance + interceptors
│   │   │   └── endpoints.js      # All API endpoint functions
│   │   ├── utils/                # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx               # Root component + routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind + global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                       # Node.js Backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT + role middleware
│   │   └── errorHandler.js       # Centralized errors
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── services/                 # External integrations
│   │   └── khaltiService.js
│   ├── utils/                    # Utility functions
│   │   ├── apiResponse.js
│   │   ├── AppError.js
│   │   └── generateToken.js
│   ├── server.js                 # Entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Data Flow

### Authentication Flow
```
User → Login Form → POST /api/auth/login
  → Server validates credentials
  → Server generates JWT
  → Response: { user, token }
  → Frontend stores token in localStorage
  → Axios interceptor attaches Bearer token to all requests
```

### Protected Route Flow
```
User navigates to /checkout
  → ProtectedRoute checks isAuthenticated
  → If no token → redirect to /login
  → If token → load user profile → render children
```

### Order Creation Flow (COD)
```
Cart → Checkout → Fill shipping → Select COD → Place Order
  → POST /api/orders { orderItems, shippingAddress, paymentMethod }
  → Server validates products + stock from DB
  → Server calculates prices (never trusts frontend)
  → Server creates order, reduces stock
  → Response: order details → redirect to order page
```

### Khalti Payment Flow
```
Cart → Checkout → Fill shipping → Select Khalti → Pay
  → POST /api/payments/khalti/initiate
  → Server creates pending order
  → Server calls Khalti API with amount in paisa
  → Khalti returns { pidx, payment_url }
  → Frontend redirects to payment_url
  → User pays on Khalti page
  → Khalti redirects to return_url?pidx=xxx
  → Frontend sends pidx → POST /api/payments/khalti/verify
  → Server verifies with Khalti API
  → Server updates order if verified
  → Frontend shows success/failure
```

## Security Layers

1. **Transport**: HTTPS in production, CORS whitelist
2. **Headers**: Helmet.js (XSS, content-type sniffing, etc.)
3. **Rate Limiting**: 100 requests per 15 minutes per IP on /api routes
4. **Authentication**: JWT with expiration (7 days)
5. **Authorization**: Role-based middleware (user, admin)
6. **Data Validation**: Mongoose schema validation + controller checks
7. **Password Security**: bcrypt with 10 salt rounds, passwords never returned in responses
8. **Payment Security**: Khalti secret key server-only, backend verifies all transactions
9. **Error Handling**: Centralized, no stack traces in production
