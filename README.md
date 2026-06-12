# Foody – Full-Stack Food Delivery App

A production-grade Next.js 14 (App Router) food delivery app with a complete backend — MongoDB, JWT auth, orders API, and a fully responsive UI.

## Features

**Frontend**
- Home page with hero, category scroller, popular restaurants, and featured dishes
- Restaurants listing with search, cuisine filter, and sort
- Menu page with search, category filter, veg toggle, and URL sync
- Cart with coupon codes (`WELCOME50`, `FREESHIP`, `BIRYANI20`, `FOODY100`, `SWEET10`, `WEEKEND25`)
- Checkout with form validation and payment selection
- Order History page (protected — login required)
- Offers, About pages
- Dark / light mode with no FOUC
- Fully mobile-responsive with sticky bottom CTAs

**Backend**
- MongoDB via Mongoose with serverless connection caching
- JWT authentication stored in httpOnly secure cookies
- Protected routes via Next.js `middleware.ts`
- Orders saved to MongoDB per user

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom CSS variables
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Language**: TypeScript

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/tanmaydev76/Foody.app.git
cd Foody.app
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foody?retryWrites=true&w=majority

# JWT secret — use a long random string in production
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

**MongoDB Atlas setup:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → create a free cluster
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for dev)
4. Copy the connection string into `MONGODB_URI`

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register, returns JWT cookie |
| POST | `/api/auth/login` | — | Login, returns JWT cookie |
| GET | `/api/auth/me` | ✓ | Current user info |
| POST | `/api/auth/logout` | — | Clear auth cookie |
| POST | `/api/orders` | ✓ | Create order |
| GET | `/api/orders` | ✓ | User's order history |
| GET | `/api/orders/[id]` | ✓ | Single order |

## Project Structure

```
app/
  api/auth/         # signup, login, me, logout
  api/orders/       # order CRUD
  login/            # login page
  signup/           # signup page
  orders/           # order history (protected)
  checkout/         # checkout (requires login)
  ...
components/         # Header, Footer, FoodCard, RestaurantCard, …
context/
  AuthContext.tsx   # auth state (user, login, signup, logout)
  CartContext.tsx   # cart state + coupons
  ThemeContext.tsx  # dark/light mode
lib/
  mongodb.ts        # Mongoose connection with caching
  auth.ts           # JWT sign/verify helpers
models/
  User.ts           # Mongoose user schema
  Order.ts          # Mongoose order schema
middleware.ts       # Protects /checkout, /orders, /profile
```
