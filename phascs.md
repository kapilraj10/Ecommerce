# Phases

## Phase 1: Project Setup
- [x] Create directory structure (client/, server/)
- [x] Initialize package.json for both client and server
- [x] Configure Vite + React + Tailwind CSS
- [x] Set up Express server with middleware (helmet, cors, morgan, rate limiting)
- [x] Set up MongoDB connection (config/db.js)
- [x] Create environment variables (.env, .env.example)
- [x] Configure .gitignore

## Phase 2: Backend Models
- [x] User model (name, email, phone, password with bcrypt, role)
- [x] Product model (name, description, price, discountPrice, category, brand, stock, images, rating)
- [x] Category model (name, slug with auto-generation, image)
- [x] Order model (user, orderItems, shippingAddress, paymentMethod/Status, orderStatus, paymentInfo, totals)

## Phase 3: Backend Authentication & Authorization
- [x] JWT token generation utility
- [x] authenticateUser middleware (extract + verify token, attach user)
- [x] authorizeRoles middleware (check user role)
- [x] Auth controller (register, login, getProfile, updateProfile, changePassword)
- [x] Auth routes with validation
- [x] Centralized error handler middleware

## Phase 4: Backend APIs
- [x] Product CRUD (create, read, update, delete)
- [x] Product listing with search, category filter, price filter, sort, pagination
- [x] Category CRUD
- [x] Order creation with stock validation + reduction
- [x] User order history + order details
- [x] API response utility (consistent success/error format)
- [x] Admin: dashboard stats, all orders, order status update, user management

## Phase 5: Khalti Payment Integration
- [x] KhaltiService class (initiate + verify)
- [x] Server-side payment initiation (validate → create pending order → call Khalti)
- [x] Server-side payment verification (verify pidx → update order status)
- [x] Idempotent payment verification (no duplicate order processing)
- [x] Stock restoration on payment failure
- [x] Environment-based sandbox/production URLs

## Phase 6: Frontend Foundation
- [x] AuthContext (login, register, logout, loadUser, isAuthenticated, isAdmin)
- [x] CartContext (addToCart, removeFromCart, updateQuantity, clearCart, totals, localStorage persistence)
- [x] ToastContext (react-hot-toast wrapper)
- [x] Axios instance with auth interceptor + 401 redirect
- [x] API endpoint service layer (authService, productService, etc.)
- [x] Route protection (ProtectedRoute, AdminRoute)
- [x] Utility helpers (formatPrice, getStatusColor, formatDate)

## Phase 7: Frontend Shared Components
- [x] Navbar (responsive, mobile menu, search, cart badge, auth links)
- [x] Footer (4-column layout, links, contact)
- [x] ProductCard (image, name, price, discount, rating, add to cart)
- [x] Pagination (page numbers with ellipsis)
- [x] ConfirmDialog (modal for delete confirmations)
- [x] LoadingSpinner (full screen + inline variants)
- [x] MainLayout (Navbar + Outlet + Footer)
- [x] AdminLayout (sidebar + mobile nav + Outlet)

## Phase 8: Frontend Public Pages
- [x] Home page (hero, features, categories, featured products)
- [x] Products listing (filters, search, sort, pagination)
- [x] Product detail (images, info, related products)
- [x] Cart page (items, quantity controls, order summary)
- [x] Login page (email, password, show/hide toggle)
- [x] Register page (full form with validation)

## Phase 9: Frontend Checkout & Payment
- [x] Checkout page (3-step: shipping → payment → review)
- [x] COD order placement
- [x] Khalti payment initiation + redirect
- [x] Payment success page (Khalti verification on load)
- [x] Payment failed page

## Phase 10: Frontend User Pages
- [x] Profile page (view info, update name/phone, change password)
- [x] My Orders page (order list with status badges)
- [x] Order Detail page (items, shipping, payment info)

## Phase 11: Frontend Admin Pages
- [x] Admin Dashboard (stats cards, recent orders table)
- [x] Admin Products (list, search, delete with confirm)
- [x] Admin Create Product (form with categories)
- [x] Admin Edit Product (pre-filled form)
- [x] Admin Categories (list, add, edit inline, delete)
- [x] Admin Orders (list, status filter, search, pagination)
- [x] Admin Order Detail (update order status + payment status)
- [x] Admin Users (list, search, toggle role, delete)

## Phase 12: Documentation & Finalization
- [x] README.md (features, setup, API docs, Khalti setup)
- [x] Architecture.md
- [x] Design.md
- [x] Memory.md
- [x] Phases.md
- [x] Rules.md
- [x] PRD.md
- [x] .gitignore

## Future Enhancements (Not Implemented)
- [ ] Cloud image upload (Cloudinary/S3)
- [ ] Email verification + password reset
- [ ] Product reviews/ratings submission
- [ ] Wishlist feature
- [ ] Coupon/discount system
- [ ] Real-time stock updates (WebSockets)
- [ ] Product image zoom
- [ ] Order tracking timeline
- [ ] Admin sales charts/graphs
- [ ] Multi-language support (Nepali/English)
