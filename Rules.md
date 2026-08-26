# Rules

## Code Rules

1. **No secrets in frontend code** — Khalti secret key, JWT secret, and all credentials stay in server `.env` only
2. **Backend calculates all prices** — Never trust price, subtotal, or total from frontend requests. Always look up product prices from the database and recalculate on the server
3. **Consistent API responses** — All API responses use `{ success: boolean, message: string, data?: any }` format
4. **Centralized error handling** — All errors flow through the error handler middleware via `next(error)` using the custom `AppError` class
5. **Password never returned** — User model uses `select: false` on password field; API responses exclude it
6. **Idempotent payment verification** — Calling the Khalti verify endpoint multiple times for the same pidx must not create duplicate orders or double-process payments
7. **Stock validated at order time** — Stock availability is checked server-side when creating orders, not at cart time
8. **Stock reduced on order, restored on failure** — If payment fails after stock reduction, stock is restored
9. **Role-based access** — All admin routes use both `authenticateUser` and `authorizeRoles("admin")` middleware
10. **Protected frontend routes** — Authenticated-only pages wrapped in `<ProtectedRoute>`, admin pages wrapped in `<AdminRoute>`
11. **No duplicate code** — Reuse components, services, and utilities. Extract common patterns into shared files
12. **Follow existing conventions** — Match code style, naming, and patterns already in the codebase when making changes

## Git Rules

1. `.env` files are never committed
2. `node_modules/` is never committed
3. `client/dist/` is never committed
4. Commit messages should be concise and descriptive
5. Only commit when explicitly asked

## File Organization Rules

1. Controllers handle request logic only — no business logic in routes
2. Services handle external API calls — KhaltiService for Khalti
3. Models define schemas and static methods only
4. Middleware functions are exported and named clearly
5. Pages are in `pages/` for route-level, `components/` for reusable
6. Admin pages go in `pages/admin/`
7. API service functions are grouped by domain in `endpoints.js`

## Styling Rules

1. Use Tailwind CSS utility classes — no inline styles
2. Use the shared component classes: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input-field`, `.card`
3. Mobile-first responsive design
4. Consistent spacing and typography from Tailwind config
5. No custom CSS unless absolutely necessary

## Security Rules

1. JWT tokens stored in localStorage (not httpOnly for SPA)
2. Axios interceptor attaches Authorization header on every request
3. 401 responses trigger automatic logout and redirect to login
4. Rate limiting applied to all `/api` routes
5. Helmet.js headers enabled
6. Input validation on both client and server
7. MongoDB injection protected by Mongoose schema validation
8. XSS prevented by React's default escaping + Helmet
