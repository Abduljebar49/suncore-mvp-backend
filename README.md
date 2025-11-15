# SunCore MVP Backend

This is the backend API for the SunCore MVP, built with **Node.js**, **Express**, and **MongoDB**. It handles core functionalities including authentication, KYC verification, payment processing via Stripe, mining data, and admin operations.

---

## 🔧 Tech Stack

- **Node.js** + **Express** for server logic
- **MongoDB** with Mongoose for database
- **Stripe API** for payments
- **iDenfy** (replacing Trulioo) and **Auth0** for KYC & auth
- **Winston** for local logging
- **Sentry** for remote error monitoring
- **ESLint + Prettier** for code formatting/linting
- **Husky + lint-staged** for Git hooks
- **GitHub Actions** for CI/CD
- **DigitalOcean** (via PM2 & NGINX) for deployment

---

## 📁 Project Structure

backend/
├── controllers/ # Request handlers (per module)
├── services/ # Business logic and integrations (Stripe, KYC, etc.)
├── routes/ # API routes
├── models/ # Mongoose schemas
├── middleware/ # Auth & error middleware
├── validators/ # express-validator logic
├── utils/ # Helpers (e.g. error handling)
├── logs/ # Winston log files
├── db/ # Database config
├── app.js # Express app config
└── server.js # App entry point

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/suncore-digital/suncore-mvp-backend.git
cd suncore-mvp-backend

2. Install Dependencies

    yarn install

3. Create .env File

    Copy .env.example and fill in your credentials:

    cp .env.example .env

Required fields:

    NODE_ENV=
    PORT=
    MONGO_URI_DEV=
    MONGO_URI_PROD=
    JWT_SECRET=
    JWT_LIFETIME=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    AUTH0_DOMAIN=
    AUTH0_AUDIENCE=
    BACKEND_DO_DEV_URL=
    FRONTEND_URL=
    SENTRY_DSN=



4. Run in Development

    yarn dev

🧪 Health Check

    GET /api/v1/health

Response:

    {
  "status": "OK",
  "version": "0.1.0",
  "timestamp": "2025-07-26T06:54:13.961Z",
  "uptime": 10.8788245,
  "memoryUsage": {
    "rss": 111972352,
    "heapTotal": 70033408,
    "heapUsed": 37779576,
    "external": 21459985,
    "arrayBuffers": 18452710
  },
  "db": {
    "status": "connected",
    "host": "ac-o1ckvay-shard-00-00.ao5nukx.mongodb.net",
    "name": "01-SUNCORE-MVP-dev-db",
    "version": "8.0.11"
  },
  "stripe": {
    "available": true,
    "apiVersion": "2025-06-30.basil"
  }
}

🛠 API Modules

| Module   | Endpoint Prefix            | Description                 |
| -------- | -------------------------- | --------------------------- |
| Auth     | `/api/v1/auth`             | Signup/Login                |
| Users    | `/api/v1/users`            | User profile, roles, status |
| KYC      | `/api/v1/kyc`              | KYC & identity              |
| Payments | `/api/v1/payments`         | Stripe integration          |
| ASICs    | `/api/v1/asics`            | ASIC metadata               |
| Mining   | `/api/v1/mining`           | Mining analytics            |
| Market   | `/api/v1/market`           | Token prices, insights      |
| Admin    | `/api/v1/admin`            | Dashboard, approvals        |
| Webhooks | `/api/v1/payments/webhook` | Stripe events               |


💅 Linting & Formatting
    This project uses:

    ESLint for code linting

    Prettier for consistent formatting

    Husky + lint-staged to auto-run eslint --fix and prettier on staged files before commits

    Run Lint Manually

    yarn lint
    ✅ Not required before commit — it's auto-run by Git hooks

    Fix Lint Issues Automatically
    yarn lint --fix

🚨 Error Monitoring with Sentry
    Sentry is used for production error tracking. DSN and environment are configured via .env.

    Errors are caught using middleware and automatically sent to Sentry in non-dev environments.

Fix Lint Issues Automatically
    yarn lint --fix


🔄 Deployment
CI/CD is configured via .github/workflows/ci-cd.yml

    Render auto-deploys based on branch:

    dev → Staging URL

    main → Production URL


👥 Contributing
    Follow GitHub flow: feature → dev → main

    Branch naming: dev-[yourname]-[feature]

    Commit clean and modular code (controller/service separation)

    Ensure all tests pass and code is clean

📃 License
    MIT
```
# suncore-mvp-backend
