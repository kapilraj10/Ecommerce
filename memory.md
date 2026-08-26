# Memory

## Project State

- **Location**: `/home/kapil/Desktop/New Folder/`
- **Frontend**: `client/` (React + Vite + Tailwind CSS)
- **Backend**: `server/` (Node.js + Express + MongoDB)
- **Date Created**: 2026-08-26

## Key Decisions

- Context API used for state management (AuthContext, CartContext) — no Redux
- Vite proxy configured to forward `/api` to localhost:5000
- Cart persisted in localStorage
- Auth token stored in localStorage
- Khalti secret key is server-only, never exposed to frontend
- Backend calculates all prices (never trusts frontend prices)
- Free shipping threshold: Rs. 1,000 (otherwise Rs. 100 shipping)
- Payment verification is idempotent (calling verify twice doesn't create duplicate orders)

## Environment

- Server port: 5000
- Client port: 5173
- MongoDB: mongodb://127.0.0.1:27017/ecommerce
- Khalti sandbox base URL: https://dev.khalti.com/api/v2

## File Map

### Server Entry Points
- `server/server.js` — main entry, express app setup
- `server/config/db.js` — mongoose connection

### Server Auth
- `server/models/User.js` — User schema with bcrypt pre-save hook
- `server/controllers/authController.js` — register, login, profile, change password
- `server/middleware/auth.js` — authenticateUser, authorizeRoles

### Server Products
- `server/models/Product.js` — Product schema with text index on name+description
- `server/controllers/productController.js` — CRUD + search/filter/sort/pagination
- `server/routes/productRoutes.js` — public GET routes
- `server/routes/adminRoutes.js` — admin CRUD routes

### Server Categories
- `server/models/Category.js` — Category with auto-slug generation
- `server/controllers/categoryController.js` — CRUD
- `server/routes/categoryRoutes.js` — public GET only

### Server Orders
- `server/models/Order.js` — Order with items, shipping, payment, status tracking
- `server/controllers/orderController.js` — create, my-orders, get-order
- `server/routes/orderRoutes.js` — authenticated routes

### Server Payments
- `server/services/khaltiService.js` — Khalti API integration (initiate + verify)
- `server/controllers/paymentController.js` — Khalti initiate + verify handlers
- `server/routes/paymentRoutes.js` — authenticated payment routes

### Server Admin
- `server/controllers/adminController.js` — dashboard stats, orders, users, products management
- `server/routes/adminRoutes.js` — all admin routes with authenticateUser + authorizeRoles("admin")

### Client State
- `client/src/context/AuthContext.jsx` — login, register, logout, updateProfile, loadUser
- `client/src/context/CartContext.jsx` — addToCart, removeFromCart, updateQuantity, clearCart, totals
- `client/src/context/ToastContext.jsx` — react-hot-toast wrapper

### Client API Layer
- `client/src/services/api.js` — Axios instance with auth interceptor
- `client/src/services/endpoints.js` — authService, productService, categoryService, orderService, paymentService, adminService

### Client Routing (App.jsx)
- `/` — HomePage
- `/products` — ProductsPage (with search/filter params)
- `/products/:id` — ProductDetailPage
- `/cart` — CartPage
- `/login` — LoginPage
- `/register` — RegisterPage
- `/checkout` — CheckoutPage (protected)
- `/profile` — ProfilePage (protected)
- `/my-orders` — MyOrdersPage (protected)
- `/orders/:id` — OrderDetailPage (protected)
- `/payment/khalti/verify` — PaymentSuccessPage (protected)
- `/payment/failed` — PaymentFailedPage (protected)
- `/admin` — AdminDashboard (admin)
- `/admin/products` — AdminProducts (admin)
- `/admin/products/create` — AdminCreateProduct (admin)
- `/admin/products/edit/:id` — AdminEditProduct (admin)
- `/admin/categories` — AdminCategories (admin)
- `/admin/orders` — AdminOrders (admin)
- `/admin/orders/:id` — AdminOrderDetail (admin)
- `/admin/users` — AdminUsers (admin)

## Admin Access

- To create admin: register user, then manually update role in MongoDB:
  ```js
  db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
  ```

## Dependencies

### Server
express, mongoose, jsonwebtoken, bcryptjs, cors, helmet, morgan, express-rate-limit, dotenv, axios, express-validator

### Client
react, react-dom, react-router-dom, axios, react-hot-toast, react-icons
Dev: vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer

## Known Limitations

- No image upload to cloud storage (uses URL strings)
- No email verification on registration
- No password reset flow
- No product reviews/ratings submission (only display)
- No wishlist feature
- No product image zoom on detail page
- No real-time stock updates
