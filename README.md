# QuickKart — Blinkit-style Quick-Commerce App (MERN Stack)

A full-stack, production-ready grocery e-commerce app modeled on Blinkit's UX:
10-minute delivery badges, category browsing, cart, checkout, and order tracking —
built with **MongoDB, Express, React (Vite), Node.js**, plain **CSS**, and **JWT authentication**.

> Branded as "QuickKart" — an original build inspired by Blinkit's quick-commerce
> pattern, not using Blinkit's name, logo, or code.

---

## 1. Architecture

```
quickkart/
├── backend/                 # Node + Express + MongoDB API
│   ├── config/db.js         # Mongoose connection
│   ├── models/               # User, Product, Cart, Order schemas
│   ├── controllers/          # Business logic (auth, products, cart, orders)
│   ├── middleware/           # JWT auth guard, admin guard, error handler
│   ├── routes/                # Express routers
│   ├── utils/generateToken.js
│   ├── seeder.js             # Sample product data loader
│   └── server.js             # App entry point
│
└── frontend/                 # React 18 + Vite SPA
    ├── src/
    │   ├── api/axios.js       # Central Axios instance (cookie + bearer token)
    │   ├── context/            # AuthContext, CartContext (React Context API)
    │   ├── components/         # Navbar, ProductCard, PrivateRoute
    │   └── pages/               # Home, Login, Signup, Cart, Orders
    └── index.html
```

**Why this structure?** It's the standard MERN separation: the backend is a stateless
REST API that could serve a web app, a mobile app, or both. The frontend never talks
to MongoDB directly — everything goes through the authenticated API.

---

## 2. JWT Authentication — how it works end to end

This is the core piece you asked about, so here's the full flow:

### Signup / Login (backend — `controllers/authController.js`)
1. User submits `name/email/password` (signup) or `email/password` (login).
2. Password is **hashed with bcrypt** before it's ever stored (`models/User.js`,
   `pre('save')` hook). Plaintext passwords are never persisted.
3. On success, `utils/generateToken.js` signs a JWT (`jsonwebtoken`) containing the
   user's ID, using `JWT_SECRET` from `.env`.
4. The token is sent back **two ways** so the client can use whichever fits:
   - As an **httpOnly cookie** (`res.cookie('jwt', token, { httpOnly: true, secure, sameSite })`) —
     this is the safer option because client-side JavaScript can never read or steal it (mitigates XSS).
   - As a **JSON field** (`{ token }`) for clients that store it themselves (e.g. mobile apps, or `localStorage` as a fallback in this demo).

### Protecting routes (`middleware/authMiddleware.js`)
- `protect` middleware checks for the token in the cookie first, then in the
  `Authorization: Bearer <token>` header.
- `jwt.verify()` validates the signature and expiry. If valid, it loads the user
  from MongoDB and attaches it as `req.user` for downstream handlers.
- `admin` middleware layers on top of `protect` to restrict product management to
  admin accounts.

### Frontend (`context/AuthContext.jsx`)
- On app load, it calls `GET /api/auth/me` — the cookie is sent automatically
  (`withCredentials: true` in `api/axios.js`) — to silently restore the session.
- `login()` / `signup()` call the API, then store the returned user object (and a
  copy of the token as a `Bearer` fallback) in state + `localStorage`.
- `PrivateRoute.jsx` wraps routes like `/orders` and redirects unauthenticated users
  to `/login`.
- `logout()` clears the cookie server-side and wipes local state.

### Why both cookie **and** bearer token?
Cookies are the more secure default for a same-site web app (protected from XSS).
The bearer-token fallback keeps the API usable from tools like Postman, mobile
clients, or a different frontend domain, without weakening the cookie path.

---

## 3. Other backend features worth knowing about
- **Rate limiting** (`express-rate-limit`) on `/api/auth/*` to slow down brute-force
  login attempts.
- **Helmet** for secure HTTP headers, **CORS** locked to your frontend's origin with
  `credentials: true` so cookies can cross origins in production.
- **Centralized error handling** (`middleware/errorMiddleware.js`) turns Mongoose
  validation/cast/duplicate-key errors into clean JSON responses instead of leaking
  stack traces.
- **Cart & Orders** are modeled properly: a `Cart` belongs to one user; placing an
  order snapshots cart items into an `Order` document (so future price changes don't
  retroactively change past orders) and clears the cart.

## 4. Frontend design notes
- Visual identity leans on the same instant-delivery cue Blinkit is known for: a
  dark "⏱ 10 MINS" badge on every product card, and a pulsing "Delivery in 10
  minutes" pill in the navbar — the one signature element the whole UI is built around.
- Palette: warm yellow (`#FFDE59`) for energy/urgency, a grocery-green
  (`#0C831F`) for all primary actions ("ADD", checkout), near-black text for contrast.
- Fonts: **Sora** (bold, geometric) for headings, **Inter** for body text — loaded
  via Google Fonts in `index.html`.
- Fully responsive down to mobile (cart layout stacks, nav wraps, grid reflows).

---

## 5. Running it locally

### Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongodb://localhost:27017/quickkart`) or a
  free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run seed               # loads sample products into your database
npm run dev                 # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

Visit `http://localhost:5173`, sign up, browse products, add to cart, and place an order.

---

## 6. Deploying it (fully deployable, free-tier friendly)

**Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster — copy the
connection string into `MONGO_URI`.

**Backend (Node/Express):** Deploy to [Render](https://render.com), Railway, or
Fly.io.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: copy everything from `.env.example`, set `NODE_ENV=production`,
  and set `CLIENT_URL` to your deployed frontend URL (needed for CORS + cookies).

**Frontend (React/Vite):** Deploy to [Vercel](https://vercel.com) or Netlify.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

**Important production detail:** since the frontend and backend live on different
domains, the JWT cookie needs `sameSite: "none"` and `secure: true` — this is already
handled in `utils/generateToken.js` based on `NODE_ENV`. Both domains must be served
over HTTPS (Render/Vercel do this by default).

---

## 7. Suggested next steps for a real production build
- Add payment gateway integration (Razorpay/Stripe) instead of COD-only.
- Add refresh tokens for shorter-lived access tokens.
- Add an admin dashboard UI for managing products/orders (the API already supports it).
- Add image upload (Cloudinary/S3) instead of hotlinked image URLs.
- Add automated tests (Jest + Supertest for the API, React Testing Library for the UI).
- Add a `robots.txt`/sitemap and SSR (Next.js) if SEO on product pages matters.
