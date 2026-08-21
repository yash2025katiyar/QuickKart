# QuickKart — Blinkit-style Quick-Commerce App (MERN Stack)

A full-stack, production-ready grocery e-commerce app modeled on Blinkit's UX:
10-minute delivery badges, category browsing, cart, checkout, and order tracking —
built with **MongoDB, Express, React (Vite), Node.js**, plain **CSS**, and **JWT authentication**.

> Branded as "QuickKart" — an original build inspired by Blinkit's quick-commerce
> pattern, not using Blinkit's name, logo, or code.

---

*Architecture

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

