# K12 Hunar — EdTech CRM & Inquiry System
> Full-Stack Assessment Task | Position: Full-Stack Developer Intern

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Supabase%20Postgres-blue.svg)](https://github.com)
[![Auth](https://img.shields.io/badge/Auth-Custom%20JWT%20%2B%20Bcrypt-emerald.svg)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📌 Executive Summary

A modern, production-grade EdTech CRM and Inquiry System engineered for **K12 Hunar**. The application allows students, parents, and schools to submit categorized inquiries regarding scholarships, cultural concerts, admissions, and general queries directly into a Supabase PostgreSQL database. 

It provides administrators with a secure, glassmorphic CRM portal protected by **custom JWT authentication** (implemented from scratch using bcrypt and jsonwebtoken, without third-party auth providers) featuring real-time multi-criteria filtering, live search by candidate name or contact number, pipeline status management, and CSV export.

---

## 🏗 Architecture & Tech Stack

```
K12_Project/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/db.js      # Supabase PostgreSQL pg pool & auto-migrations
│   │   ├── controllers/      # Inquiry & Auth business logic
│   │   ├── middleware/       # Custom JWT verifier & request validation
│   │   ├── routes/           # REST endpoints
│   │   ├── utils/token.js    # JWT signature & verification utilities
│   │   ├── index.js          # Express app entry & security middleware
│   │   └── seed.js           # Database seeder for admin & demo inquiries
│   ├── .env.example
│   └── package.json
├── frontend/                 # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Glassmorphism UI, Inquiry Form, Hero, Dashboard
│   │   ├── context/          # Custom JWT Auth Context & session management
│   │   ├── services/api.js   # Fetch client with Bearer token interceptor
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── schema.sql                # Complete PostgreSQL table creation & index script
├── .env.example              # Root template with Supabase config
├── README.md                 # Setup, testing, and deployment instructions
└── package.json              # Monorepo orchestration scripts
```

| Component | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, Helmet, CORS, Morgan |
| **Database** | Supabase (PostgreSQL via node-postgres `pg` pool) |
| **Authentication** | **Custom JWT from Scratch** (`jsonwebtoken` + `bcryptjs`) — *No Supabase Auth* |
| **Security** | Bcrypt (10 salt rounds), Protected Route Middleware, SQL Injection Parameterization |

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env` in the root (or individually inside `/backend` and `/frontend`):

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend Variables (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL URI (From Supabase Project -> Settings -> Database -> Connection string URI)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Custom JWT Authentication Secrets
JWT_SECRET=k12_hunar_custom_jwt_secret_key_production_grade_random_hash_987654321
JWT_EXPIRES_IN=24h

# Allowed Client Origin
CLIENT_URL=http://localhost:5173

# Admin Initial Seed Credentials
DEFAULT_ADMIN_NAME="K12 Hunar SuperAdmin"
DEFAULT_ADMIN_EMAIL=admin@k12hunar.com
DEFAULT_ADMIN_PASSWORD=Admin@12345
```

### Frontend Variables (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

### Option A: Using Supabase Dashboard (Recommended)
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in the left sidebar.
3. Open [`schema.sql`](./schema.sql) from this repository, copy its entire contents, paste it into the SQL Editor, and click **Run**.
4. Navigate to **Project Settings** → **Database** → **Connection String** → Select **URI** (or Transaction Pooler).
5. Copy the connection string and paste it as `DATABASE_URL` in `backend/.env`.

### Option B: Automated Seeder CLI
Run the automated seed script to initialize tables and insert default credentials:
```bash
npm run seed --prefix backend
```

---

## 🚀 Local Installation & Execution

### 1. Install All Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install manually: `cd backend && npm install`, then `cd ../frontend && npm install`)*

### 2. Run Backend & Frontend Concurrently
In **Terminal 1** (Backend):
```bash
npm run dev:backend
# Starts Express server at http://localhost:5000
```

In **Terminal 2** (Frontend):
```bash
npm run dev:frontend
# Starts Vite React dev server at http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🛡️ Default Admin Credentials

| Field | Value |
|---|---|
| **Portal URL** | Click **Admin Portal Login** on navbar |
| **Email** | `admin@k12hunar.com` |
| **Password** | `Admin@12345` |
| **Auth Type** | Custom JWT Bearer Token (Stored in `localStorage`) |

---

## 🧪 How to Test Custom JWT Authentication

### 1. Quick Testing via Browser UI
1. Click **Admin Portal Login** in the navigation bar.
2. Click the **Auto-Fill** badge (loads `admin@k12hunar.com` & `Admin@12345`).
3. Click **Verify & Generate JWT**.
4. The system validates credentials via bcrypt, issues a signed JWT, stores it securely, and navigates you into the **Admin CRM Dashboard**.

---

### 2. Testing via Terminal (cURL)

#### Step 1: Attempt Accessing Protected Inquiries Without Token (Expect HTTP 401)
```bash
curl -X GET http://localhost:5000/api/inquiries
```
**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. Missing Authorization header."
}
```

#### Step 2: Authenticate Admin & Obtain Custom JWT
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@k12hunar.com","password":"Admin@12345"}'
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Admin authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "K12 Hunar SuperAdmin",
    "email": "admin@k12hunar.com",
    "role": "admin"
  }
}
```

#### Step 3: Access Protected Route With Custom Bearer Token
```bash
curl -X GET http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

#### Step 4: Test Search and Filters
* Search by name:
  ```bash
  curl -X GET "http://localhost:5000/api/inquiries?search=Aarav" -H "Authorization: Bearer <TOKEN>"
  ```
* Filter by Category (`Scholarship`):
  ```bash
  curl -X GET "http://localhost:5000/api/inquiries?category=Scholarship" -H "Authorization: Bearer <TOKEN>"
  ```
* Filter by User Type (`Parent`):
  ```bash
  curl -X GET "http://localhost:5000/api/inquiries?userType=Parent" -H "Authorization: Bearer <TOKEN>"
  ```

---

## 🌐 Live Deployment Guide

### Deploy Backend (Render / Railway)
1. Push this repository to GitHub.
2. On [Render](https://render.com), create a **New Web Service** connected to your repo.
3. Configure:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node src/index.js`
4. In **Environment Variables**, add:
   * `DATABASE_URL` (Your Supabase connection string)
   * `JWT_SECRET` (A strong random string)
   * `CLIENT_URL` (Your Vercel/Netlify frontend URL)
   * `NODE_ENV` = `production`

### Deploy Frontend (Vercel / Netlify)
1. On [Vercel](https://vercel.com), import the repository.
2. Configure:
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add Environment Variable:
   * `VITE_API_BASE_URL` = `https://your-backend-app.onrender.com/api`
4. Deploy!

---

## 📋 Evaluation Rubric Compliance Checklist

- [x] **Public Inquiry Form**: Includes User Type dropdown (Parent, Student, School), Category dropdown (Scholarship, Concert, Admission, General Query), Personal details (Name, Email, Phone), Message textarea.
- [x] **Database Integration**: Saves directly to Supabase PostgreSQL using `pg` pool.
- [x] **Custom JWT Authentication**: Implemented from scratch (bcrypt hashing + JWT generation + protected route middleware). *No Supabase Auth used*.
- [x] **Protected Admin Dashboard**: Route guard prevents unauthorized access; shows tabular view with Name, Phone, Email, User Type, Category, Date, Status.
- [x] **Mandatory Filters & Search**: Search bar for Name or Phone; Filters for Category and User Type.
- [x] **Deliverables**:
  - [x] GitHub Repository clean structure (`backend/` & `frontend/`)
  - [x] `schema.sql` database file
  - [x] `.env.example` template with Supabase config
  - [x] `README.md` with complete setup and testing instructions
  - [x] Live deployment ready
