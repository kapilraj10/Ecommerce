# Design

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary 50 | #eff6ff | Light backgrounds, hover states |
| Primary 100 | #dbeafe | Badge backgrounds |
| Primary 500 | #3b82f6 | Links, interactive elements |
| Primary 600 | #2563eb | Buttons, primary actions |
| Primary 700 | #1d4ed8 | Button hover states |
| Primary 900 | #1e3a8a | Dark accents |
| Gray 50 | #f9fafb | Page background |
| Gray 100 | #f3f4f6 | Card borders, subtle dividers |
| Gray 300 | #d1d5db | Input borders |
| Gray 500 | #6b7280 | Secondary text, labels |
| Gray 800 | #1f2937 | Primary text |
| Gray 900 | #111827 | Footer background |
| Green 100/600 | #dcfce7/#16a34a | Success states, in stock |
| Red 100/600 | #fee2e2/#dc2626 | Error states, out of stock, delete |
| Yellow 100/400 | #fef9c3/#facc15 | Warning, star ratings |
| Purple 100/600 | #f3e8ff/#9333ea | Admin badges, shipped status |

## Typography

- **Font**: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: font-bold (700), text-gray-900
- **Body**: font-normal (400), text-gray-600 to text-gray-800
- **Small/Labels**: text-sm (14px), text-gray-500 to text-gray-700

## Component Design System

### Buttons
```
.btn-primary:     bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700
.btn-secondary:   bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300
.btn-danger:      bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700
Disabled state:   opacity-50 cursor-not-allowed
```

### Form Inputs
```
.input-field:     w-full px-4 py-2 border border-gray-300 rounded-lg
Focus:            focus:ring-2 focus:ring-primary-500 focus:border-transparent
```

### Cards
```
.card:            bg-white rounded-xl shadow-sm border border-gray-100 p-6
```

### Status Badges
```
Pending:    text-yellow-600 bg-yellow-100
Processing: text-blue-600 bg-blue-100
Shipped:    text-purple-600 bg-purple-100
Delivered:  text-green-600 bg-green-100
Cancelled:  text-red-600 bg-red-100
Paid:       text-green-600 bg-green-100
Failed:     text-red-600 bg-red-100
Refunded:   text-gray-600 bg-gray-100
```

## Layout

### Main Store Layout
```
┌──────────────────────────────────────┐
│  Navbar (sticky, z-50, shadow-sm)   │
│  Logo | Search Bar | Nav Links | Cart│
├──────────────────────────────────────┤
│                                      │
│          <Outlet />                  │
│       (Page Content)                │
│                                      │
├──────────────────────────────────────┤
│  Footer (bg-gray-900, text-gray-300)│
│  4-column: Brand | Links | Account  │
│            | Contact                 │
└──────────────────────────────────────┘
```

### Admin Layout
```
┌────────┬────────────────────────────┐
│Sidebar │  Admin Content             │
│(fixed) │                            │
│ 256px  │  <Outlet />               │
│        │                            │
│ Links: │                            │
│ - Dash │                            │
│ - Prod │                            │
│ - Cate │                            │
│ - Orde │                            │
│ - User │                            │
│        │                            │
│ Back → │                            │
└────────┴────────────────────────────┘

Mobile: Top horizontal scrolling nav bar
```

## Responsive Breakpoints

- **Mobile**: < 640px — single column, hamburger menu, stacked layouts
- **Tablet**: 640px - 1024px — 2-column grids, condensed spacing
- **Desktop**: > 1024px — full layouts, sidebar admin, 3-4 column grids

## Page Designs

### Home Page
1. Hero section (gradient primary-600 to primary-800, white text)
2. Feature icons (4-column: shipping, support, security, returns)
3. Categories grid (2-6 columns responsive)
4. Featured products (4-column grid)

### Product Listing
1. Left sidebar filters (category, price range) — collapsible on mobile
2. Sort bar (Latest, Price Low-High, Price High-Low, Top Rated)
3. Product grid (3 columns desktop, 2 tablet, 1 mobile)
4. Pagination

### Product Detail
1. Image gallery (large + thumbnails) — left side
2. Product info (name, price, rating, stock, description, add to cart) — right side
3. Related products section

### Checkout (3 Steps)
1. Shipping address form
2. Payment method selection (COD or Khalti)
3. Order review + confirmation

### Cart
1. Cart items list (left, 2/3 width)
2. Order summary sidebar (right, 1/3 width)
