# Product Requirements Document (PRD)

## Product Name
**E-Shop Nepal** — Full Stack MERN E-Commerce Application

## Vision
Build a complete, production-ready e-commerce web application for the Nepal market with Khalti payment integration and Cash on Delivery support.

## Target Users
1. **Customers** — Browse, search, buy products online
2. **Admins** — Manage products, categories, orders, users

## Core Features

### 1. User Authentication
- Register with name, email, phone, password
- Login with email and password
- JWT-based session management
- Profile viewing and editing
- Password change
- Role-based access: user, admin

### 2. Product Catalog
- Public product listing with images, names, prices
- Product detail page with description, stock, rating
- Search by name/description
- Filter by category
- Filter by price range (min/max)
- Sort by: newest, price low-high, price high-low, rating
- Pagination (12 products per page)
- Related products on detail page
- Discount price display with percentage badge

### 3. Category System
- Categories displayed on home page
- Filter products by category on listing page
- Admin CRUD for categories
- Auto-slug generation

### 4. Shopping Cart
- Add products to cart
- Remove products from cart
- Increase/decrease quantity
- Stock validation (quantity cannot exceed stock)
- Cart persists in localStorage
- Subtotal, shipping cost, total display
- Free shipping on orders over Rs. 1,000

### 5. Checkout
- 3-step checkout flow: Shipping → Payment → Review
- Shipping address: name, phone, email, province, district, city, address
- Payment method selection: COD or Khalti
- Order review before placement
- Stock validation on server before order creation

### 6. Payment — Cash on Delivery
- Order created with paymentStatus: Pending
- Stock reduced immediately
- Admin updates status after delivery
- Status workflow: Pending → Processing → Shipped → Delivered

### 7. Payment — Khalti ePayment
- Server-side payment initiation (secret key never exposed)
- Redirect to Khalti payment page
- Return URL with pidx parameter
- Server-side verification before marking as paid
- Idempotent verification (no duplicate processing)
- Stock restoration on payment failure
- Payment info stored (pidx, transactionId, status)

### 8. Order Management (User)
- View order history with pagination
- View order details (items, shipping, payment, status)
- Status badges with color coding

### 9. Admin Dashboard
- Total users, products, orders, sales statistics
- Pending and delivered order counts
- Recent orders table

### 10. Admin Product Management
- List all products with search and pagination
- Create product with all fields
- Edit product (pre-filled form)
- Delete product with confirmation dialog
- Stock visibility

### 11. Admin Category Management
- List categories
- Add category (inline form)
- Edit category (inline)
- Delete with confirmation

### 12. Admin Order Management
- List all orders with search and filter
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
- Update order status
- Update payment status
- View full order details

### 13. Admin User Management
- List all users with search and pagination
- Toggle user role (user ↔ admin)
- Delete user with confirmation

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- PUT /api/auth/change-password

### Products (Public)
- GET /api/products (query: search, category, minPrice, maxPrice, sort, page, limit)
- GET /api/products/:id
- GET /api/products/:id/related

### Categories (Public)
- GET /api/categories

### Orders (Authenticated)
- POST /api/orders
- GET /api/orders/my-orders
- GET /api/orders/:id

### Payments (Authenticated)
- POST /api/payments/khalti/initiate
- POST /api/payments/khalti/verify

### Admin (Admin Only)
- GET /api/admin/dashboard
- GET/POST /api/admin/products
- PUT/DELETE /api/admin/products/:id
- POST /api/admin/categories
- PUT/DELETE /api/admin/categories/:id
- GET /api/admin/orders
- GET /api/admin/orders/:id
- PUT /api/admin/orders/:id/status
- PUT /api/admin/orders/:id/payment-status
- GET /api/admin/users
- PUT /api/admin/users/:id/role
- DELETE /api/admin/users/:id

## Success Metrics
- All pages load and function correctly
- Authentication works end-to-end
- Products can be browsed, filtered, searched
- Cart operations work correctly with stock limits
- COD orders are created and tracked
- Khalti sandbox payments can be initiated and verified
- Admin can manage all resources
- Responsive on mobile, tablet, desktop
- No crashes or unhandled errors

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Helmet, Rate Limiting
- **Payments**: Khalti ePayment Gateway (sandbox + production)
