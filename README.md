
#  Food Ordering — React Native App

A full-stack **mobile pizza ordering application** built with **React Native (Expo)** and **Supabase**, featuring role-based access control, real-time order tracking, and a complete admin dashboard.

---

## 🚀 Overview

Food Ordering is a production-ready food ordering app that supports two roles:

- **User** — Browse the menu, add items to cart, place orders, and track order status in real time
- **Admin** — Manage products (create, update, delete), view all orders, and update order statuses

---

📱 Screenshots
🔐 Authentication
<p align="center">
  <img src="https://github.com/user-attachments/assets/583cbb91-b778-468e-b4ca-4cef47589338" width="220"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/528bc15d-2814-43f0-86ff-400566438e27" width="220"/>
</p>
<p align="center">
  <sub>Sign In &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Role Selection</sub>
</p>

## ✨ Features

### 👤 User Features
- **Browse Menu** — Grid view of all available pizzas with images and prices
- **Product Details** — Full-screen product view with size selector (S / M / L / XL)
- **Cart** — Add multiple items, adjust quantities, see running total
- **Checkout** — Place orders directly from cart
- **Order Tracking** — Real-time status updates: `New → Cooking → Delivering → Delivered`
- **Order History** — Active orders and archived (delivered) orders in separate tabs
- **Profile Tab** — User profile management

### 🛡️ Admin Features
- **Product Management** — Full CRUD: create, read, update, and delete products
- **Image Upload** — Select and upload product images via Supabase Storage
- **Order Dashboard** — View all incoming orders with timestamps
- **Status Control** — Update any order's status with one tap (New / Cooking / Delivering / Delivered)
- **Real-time Updates** — Order changes reflect instantly for both admin and user

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile UI |
| **Expo** | Development tooling & build system |
| **Expo Router** | File-based navigation |
| **Supabase** | Backend: Auth, Database, Storage, Realtime |
| **Supabase Auth** | Email/password authentication |
| **Supabase Realtime** | Live order status updates |
| **Supabase Storage** | Product image hosting |
| **TypeScript** | Type safety |

---

## 🗂️ Project Structure

```
FoodOrdering/
│
├── src/
│   └── api/
│       ├── order-items/
│       │   └── index.ts             # Order items API calls
│       ├── orders/
│       │   ├── index.ts             # Orders CRUD API calls
│       │   └── subscriptions.ts     # Realtime order subscriptions
│       └── products/
│           └── index.ts             # Products CRUD API calls
│
├── app/
│   ├── (admin)/
│   │   ├── menu/
│   │   │   ├── _layout.tsx          # Admin menu layout
│   │   │   ├── [id].tsx             # Product detail (admin view)
│   │   │   ├── create.tsx           # Create new product
│   │   │   └── index.tsx            # Admin menu list
│   │   ├── orders/
│   │   │   ├── list/                # Orders list sub-folder
│   │   │   ├── _layout.tsx          # Admin orders layout
│   │   │   └── [id].tsx             # Order detail + Status control
│   │   ├── _layout.tsx              # Admin root layout
│   │   └── index.tsx                # Admin home (redirects to menu)
│   │
│   ├── (auth)/                      # Auth screens group
│   │
│   ├── (user)/                      # User screens group
│   │   └── _layout.tsx              # User root layout
│   │
│   ├── +html.tsx                    # Custom HTML shell (web)
│   ├── +not-found.tsx               # 404 screen
│   ├── cart.tsx                     # Shopping cart + Checkout
│   └── index.tsx                    # Role-based router (User / Admin / Sign-out)
│
├── assets/                          # Images and fonts
└── supabase/
    └── migrations/                  # DB schema migrations
```

---

## 🗄️ Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK → auth.users |
| group | text | `'USER'` or `'ADMIN'` |

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| name | text | Product name |
| image | text | Storage URL |
| price | float | Price in USD |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| status | text | New / Cooking / Delivering / Delivered |
| user_id | uuid | FK → profiles |
| created_at | timestamp | Auto-generated |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| order_id | int | FK → orders |
| product_id | int | FK → products |
| size | text | S / M / L / XL |
| quantity | int | — |

---

## 🔐 Authentication & Authorization

- Auth is handled entirely by **Supabase Auth** (email + password)
- On sign-up, a `profiles` row is created with `group = 'USER'` by default
- Admin accounts have `group = 'ADMIN'` set manually or via Supabase dashboard
- Expo Router redirects users to the correct layout (`(user)` or `(admin)`) based on their profile group
- Row Level Security (RLS) policies on Supabase enforce data access rules

---

## ⚡ Real-time Order Tracking

Supabase Realtime subscriptions are used so:
- **Users** see their order status update live without refreshing
- **Admins** see new orders appear instantly as they come in

```ts
supabase
  .channel('orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders',
  }, (payload) => {
    // update local state
  })
  .subscribe();
```

---

## 🛒 Cart System

The cart is managed via a **React Context Provider** with local state. It supports:
- Adding items with size selection
- Increasing / decreasing quantity
- Removing items
- Computing totals
- Clearing on checkout

On checkout, an `order` and associated `order_items` rows are inserted into Supabase.

---

### 5. Run the app
```bash
npx expo start
```

Scan the QR code with **Expo Go** or run on a simulator.

---


## ⚠️ Known Limitations

- No payment gateway (orders are placed without payment)
- Cart is not persisted across sessions (in-memory only)
- Admin role must be assigned manually via Supabase dashboard
- No push notification support yet

---

## 👨‍💻 Author

Built to demonstrate a production-grade mobile app architecture with:
- Role-based authentication
- Real-time data sync
- Full CRUD with cloud storage
- Clean file-based navigation with Expo Router

---

## 📄 License

MIT License — feel free to use and modify.
