# 💰 SpendSmart — Smart Personal Expense Tracker

A full-stack MERN application for tracking personal expenses with real-time insights, smart alerts, and visual analytics.

> Built based on **Market & Research Validation** — validated with college students, young employees, and families who struggle with digital payment tracking.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
moneyproject/
├── backend/          # Express.js REST API
│   ├── config/       # DB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # JWT auth
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── .env          # Environment variables
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite app
    └── src/
        ├── api/      # Axios calls
        ├── components/
        ├── context/  # Auth context
        ├── pages/    # All pages
        └── utils/    # Constants & helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get user |
| GET | /api/expenses | List expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Update |
| DELETE | /api/expenses/:id | Delete |
| GET | /api/expenses/summary | Category summary |
| GET/POST | /api/budget | Get/Set budget |
| GET | /api/dashboard/stats | Dashboard data |

---

## ✨ Key Features

- 🔐 JWT Authentication
- 📊 Real-time Dashboard with Charts
- 🤖 Auto-categorization from title
- 📲 UPI/Card/Cash payment tracking
- 🎯 Monthly budget with per-category limits
- 🚨 Smart overspending alerts
- 📈 6-month spending trend
- 🔍 Search & Filter expenses
- 📱 Responsive dark UI
