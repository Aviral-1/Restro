# 🍽️ Restro QR — Restaurant Ordering & Delivery Tracking SaaS

A complete **multi-restaurant QR ordering SaaS platform** — customers scan a QR code, browse the menu, order food, pay online, and track delivery in real-time.

![Platform](https://img.shields.io/badge/Platform-SaaS-22C55E) ![Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20NestJS-blue) ![DB](https://img.shields.io/badge/DB-MongoDB-green) ![Realtime](https://img.shields.io/badge/Realtime-WebSocket-purple)

## 🏗️ Architecture

```
/apps
  /customer-app     → Next.js 14 (port 3000) — Customer menu & ordering
  /admin-dashboard  → Next.js 14 (port 3001) — Restaurant admin panel
  /delivery-app     → Next.js 14 (port 3002) — Delivery partner app

/backend
  /nest-api         → NestJS (port 4000) — REST API + WebSocket

/packages
  /types            → Shared TypeScript interfaces
  /utils            → Shared utility functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or use Docker)

### Install & Run

```bash
npm install
npm run dev
```

This starts all 4 services concurrently:
| Service | URL |
|---------|-----|
| Customer App | http://localhost:3000 |
| Admin Dashboard | http://localhost:3001 |
| Delivery App | http://localhost:3002 |
| API Server | http://localhost:4000 |

### Seed Demo Data

```bash
npm run seed
```

Creates a demo restaurant ("Green Leaf Kitchen") with 22 menu items, 10 tables, and sample orders.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@restro.com | password123 |
| Restaurant Owner | raj@greenleaf.com | password123 |
| Delivery Partner | vikram@delivery.com | password123 |
| Customer | priya@customer.com | password123 |

## 📱 Customer Flow

1. **Scan QR** → Opens menu at `/menu?restaurantId=xxx&table=5`
2. **Browse** → Search, filter by category, view item details
3. **Add to Cart** → Sticky bottom cart, quantity controls
4. **Checkout** → Enter details, choose payment (UPI/Card/Wallet)
5. **Track** → Live order status with animated timeline

## 🏪 Admin Dashboard

- **Overview** — Stats, AI insights, recent orders, top items
- **Orders** — Kanban-style order management with status progression
- **Menu** — Category & item CRUD with availability toggles
- **QR Codes** — Generate downloadable QR codes for each table
- **Analytics** — Revenue trends, peak hours, customer breakdown

## 🛵 Delivery App

- Online/offline toggle
- Active delivery cards with expand for details
- Accept → Pickup → Deliver flow
- Call customer button
- Map navigation placeholder (add Google Maps API key)

## ⚡ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Zustand, Framer Motion |
| Backend | NestJS, Mongoose, Passport JWT, Socket.io |
| Database | MongoDB |
| Payments | Razorpay (mock/test mode) |
| Realtime | WebSocket (Socket.io) |
| Infrastructure | Docker, Docker Compose |

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/restro-qr` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | dev default |
| `RAZORPAY_KEY_ID` | Razorpay test key | `rzp_test_demo` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | demo |
| `GOOGLE_MAPS_KEY` | Google Maps API key | demo |

## 🐳 Docker

```bash
docker-compose up --build
```

Services: MongoDB, Redis, NestJS API, Customer App, Admin Dashboard, Delivery App.

## 📡 API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile` |
| Restaurants | `CRUD /api/restaurants`, `GET /api/restaurants/:id/tables` |
| Menu | `CRUD /api/menu/categories`, `CRUD /api/menu/items`, `GET /api/menu/full/:id` |
| Orders | `POST /api/orders`, `GET /api/orders`, `PATCH /api/orders/:id/status` |
| Payments | `POST /api/payments/create-order`, `POST /api/payments/verify` |
| Delivery | `GET /api/delivery/partners`, `GET /api/delivery/assignments/:id` |
| Analytics | `GET /api/analytics/dashboard/:restaurantId` |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_restaurant` | Client → Server | Subscribe to restaurant events |
| `join_order` | Client → Server | Subscribe to order updates |
| `new_order` | Server → Client | New order notification |
| `order_status_update` | Server → Client | Status change broadcast |
| `delivery_location_update` | Server → Client | Driver location update |

## 📄 License

MIT
