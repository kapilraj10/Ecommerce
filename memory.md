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

### Server Reviews
- `server/models/Review.js` — Review with auto-calculated product rating
- `server/controllers/reviewController.js` — CRUD + my-review per product
- `server/routes/reviewRoutes.js` — public GET, authenticated write/update/delete

### Server Wishlist
- `server/models/Wishlist.js` — User wishlist with product refs
- `server/controllers/wishlistController.js` — get, toggle, check
- `server/routes/wishlistRoutes.js` — all authenticated

### Server Coupons
- `server/models/Coupon.js` — Coupon with percentage/fixed discount, expiry, usage limits
- `server/controllers/couponController.js` — validate, apply, CRUD (admin)
- `server/routes/couponRoutes.js` — validate/apply authenticated, CRUD admin-only

### Server Uploads (Cloudinary)
- `server/services/cloudinaryService.js` — upload, uploadMultiple, delete from Cloudinary
- `server/services/upload.js` — multer config for local temp storage
- `server/controllers/uploadController.js` — upload single/multiple, delete
- `server/routes/uploadRoutes.js` — admin-only

### Server Email / Password Reset
- `server/services/emailService.js` — nodemailer with verification + reset email templates
- `server/controllers/passwordResetController.js` — forgotPassword, resetPassword, verifyEmail, resendVerification
- `server/routes/passwordResetRoutes.js` — public forgot/reset, authenticated resend

### Server Admin
- `server/controllers/adminController.js` — dashboard stats, orders, users, products management
- `server/routes/adminRoutes.js` — all admin routes with authenticateUser + authorizeRoles("admin")

### Client State
- `client/src/context/AuthContext.jsx` — login, register, logout, updateProfile, loadUser
- `client/src/context/CartContext.jsx` — addToCart, removeFromCart, updateQuantity, clearCart, totals
- `client/src/context/WishlistContext.jsx` — toggleWishlist, isWishlisted, items
- `client/src/context/ToastContext.jsx` — react-hot-toast wrapper

### Client i18n
- `client/src/utils/i18n.js` — i18next with English + Nepali translations, localStorage persistence

### Client API Layer
- `client/src/services/api.js` — Axios instance with auth interceptor
- `client/src/services/endpoints.js` — authService, productService, categoryService, orderService, paymentService, reviewService, couponService, adminService

### Client Shared Components
- `client/src/components/ImageZoom.jsx` — mouse-follow zoom on product images
- `client/src/components/OrderTimeline.jsx` — step-by-step order progress display
- `client/src/components/SalesChart.jsx` — Recharts BarChart + PieChart
- `client/src/components/CouponInput.jsx` — coupon code input + validate + apply
- `client/src/components/LanguageToggle.jsx` — EN/NE language switcher

### Client Routing (App.jsx)
- `/` — HomePage
- `/products` — ProductsPage (with search/filter params)
- `/products/:id` — ProductDetailPage (reviews, zoom, wishlist)
- `/cart` — CartPage
- `/login` — LoginPage
- `/register` — RegisterPage
- `/forgot-password` — ForgotPasswordPage
- `/reset-password/:token` — ResetPasswordPage
- `/verify-email` — VerifyEmailPage
- `/checkout` — CheckoutPage (protected, with coupon support)
- `/profile` — ProfilePage (protected)
- `/my-orders` — MyOrdersPage (protected)
- `/orders/:id` — OrderDetailPage (protected, with OrderTimeline)
- `/wishlist` — WishlistPage (protected)
- `/payment/khalti/verify` — PaymentSuccessPage (protected)
- `/payment/failed` — PaymentFailedPage (protected)
- `/admin` — AdminDashboard (admin, with sales charts)
- `/admin/products` — AdminProducts (admin)
- `/admin/products/create` — AdminCreateProduct (admin)
- `/admin/products/edit/:id` — AdminEditProduct (admin)
- `/admin/categories` — AdminCategories (admin)
- `/admin/orders` — AdminOrders (admin)
- `/admin/orders/:id` — AdminOrderDetail (admin, with timeline + history)
- `/admin/users` — AdminUsers (admin)
- `/admin/coupons` — AdminCoupons (admin)

## Admin Access

- To create admin: register user, then manually update role in MongoDB:
  ```js
  db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
  ```

## Dependencies

### Server
express, mongoose, jsonwebtoken, bcryptjs, cors, helmet, morgan, express-rate-limit, dotenv, axios, express-validator, cloudinary, multer, nodemailer, socket.io

### Client
react, react-dom, react-router-dom, axios, react-hot-toast, react-icons, socket.io-client, recharts, react-image-zoom, i18next, react-i18next
Dev: vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer

## Implemented Enhancements

- **Cloud image upload**: Cloudinary integration via `/api/upload/image`, `/api/upload/multiple`, `/api/upload`
- **Email verification + password reset**: nodemailer with SMTP, token-based reset via `/api/auth/forgot-password`, `/api/auth/reset-password/:token`, `/api/auth/verify-email/:token`, `/api/auth/resend-verification`
- **Product reviews/ratings**: Review model with auto-calculated product rating, `/api/reviews/*`
- **Wishlist**: Toggle products in/out, `/api/wishlist/*`
- **Coupon/discount system**: Percentage or fixed coupons with min purchase, max discount, usage limits, expiry. `/api/coupons/*`
- **Real-time stock updates**: Socket.io, room per product, stock-update events emitted on order creation and product update
- **Product image zoom**: ImageZoom component with mouse-follow zoom on product detail page
- **Order tracking timeline**: OrderTimeline component showing Pending→Processing→Shipped→Delivered, status history stored on Order model
- **Admin sales charts**: Recharts BarChart for monthly sales, PieChart for order status distribution on admin dashboard
- **Multi-language**: i18next with English and Nepali (ne) translations, LanguageToggle component

## Known Limitations

- Cloudinary credentials need real sandbox keys
- SMTP credentials need real email provider
- No image upload to cloud storage from admin product forms (URL input only)
- No product video support
