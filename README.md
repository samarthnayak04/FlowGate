# FlowGate — Enterprise Approval Workflow System

> A production-grade internal approval workflow system that replaces informal email and chat-based approvals with a structured, secure, and fully auditable request lifecycle.

## 🔗 Live Demo

- **Frontend:** [https://flowgate.vercel.app](https://flowgate.vercel.app)
- **Backend API:** [https://flowgate-backend.onrender.com](https://flowgate-backend.onrender.com)

## Overview

FlowGate solves a real problem in organizations — approvals that happen over WhatsApp, email threads, and verbal confirmations with no audit trail. It provides a structured state machine for request lifecycle management, role-based access control enforced at the backend middleware level, an immutable audit log for every state change, and HTTP-only cookie authentication for XSS protection.

## ✨ Features

### Authentication

- JWT-based auth with HTTP-only cookies (XSS protection)
- Role-based registration (USER, APPROVER — ADMIN assigned manually)
- Persistent sessions with secure logout

### Request Lifecycle

- Create requests as DRAFT
- Edit drafts before submission
- Submit for approval (locks editing)
- Approve or reject by assigned approver
- Full audit trail per request

### Role-Based Dashboards

- **USER** — Create, submit, and track own requests
- **APPROVER** — Review and action assigned requests
- **ADMIN** — System-wide visibility with filters

### Audit Logging

- Append-only audit logs (no updates, no deletes)
- Tracks action, status transition, performer, and timestamp
- Accessible to request creator, assigned approver, and admin

## 🛠 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS v4, React Router v6, Axios, react-hot-toast, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, Docker

**Infrastructure:** MongoDB Atlas, Render (backend), Vercel (frontend)

## 🔄 Request Lifecycle

```
DRAFT ──► SUBMITTED ──► APPROVED
                   └──► REJECTED
```

Every transition is **enforced server-side** — the frontend cannot bypass these rules. Once submitted, a request is locked for editing. Once approved or rejected, it becomes read-only permanently.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Docker (optional, for backend)

### Frontend Setup

```bash
git clone https://github.com/yourusername/flowgate-frontend.git
cd flowgate-frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

### Backend Setup

```bash
git clone https://github.com/yourusername/flowgate-backend.git
cd flowgate-backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, ALLOWED_ORIGIN
npm run dev
```

### Run with Docker

```bash
docker build --platform linux/amd64 -t flowgate-backend .

docker run -p 5000:5000 \
  -e MONGO_URI=your_mongo_uri \
  -e JWT_SECRET=your_jwt_secret \
  -e ALLOWED_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  flowgate-backend
```

## 🔐 Environment Variables

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

### Backend `.env`

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_64_char_hex_secret
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=5000
```

> Generate a secure JWT secret: `openssl rand -hex 64`

## 📡 API Endpoints

### Auth

```
POST /api/auth/register    — Register new user
POST /api/auth/login       — Login and set cookie
POST /api/auth/logout      — Clear auth cookie
```

### Requests

```
POST   /api/requests                  — Create draft (USER)
PUT    /api/requests/:id              — Edit draft (USER)
POST   /api/requests/:id/submit       — Submit draft (USER)
POST   /api/requests/:id/approve      — Approve request (APPROVER)
POST   /api/requests/:id/reject       — Reject request (APPROVER)
GET    /api/requests/my               — Get own requests (USER)
GET    /api/requests/pending          — Get pending approvals (APPROVER)
GET    /api/requests/all              — Get all requests (ADMIN)
GET    /api/requests/:id              — Get request detail
GET    /api/requests/:id/logs         — Get audit logs
```

## 🚢 Deployment

### Backend → Render (Docker)

```bash
docker build --platform linux/amd64 -t yourusername/flowgate-backend:latest .
docker push yourusername/flowgate-backend:latest
```

Then create a new Web Service on Render, select "Deploy an existing Docker image", and add your environment variables.

### Frontend → Vercel

Push frontend to GitHub, import the repo on [vercel.com](https://vercel.com), add `VITE_API_URL=https://your-render-url.onrender.com` as an environment variable, and deploy.

## 🔒 Security Highlights

- **HTTP-only cookies** — JWT stored in HTTP-only cookies, not localStorage (XSS protection)
- **CORS locked** — Only the specified frontend origin is allowed
- **Role enforcement** — RBAC enforced at middleware level, not just UI
- **State machine** — Invalid transitions rejected server-side
- **Immutable audit logs** — No update/delete operations on audit records
- **Fail-fast startup** — Server refuses to start without required env vars
- **Production error handling** — Stack traces hidden in production

## 📁 Project Structure

### Frontend

```
src/
├── components/
│   ├── CreateRequestModal.jsx
│   ├── ProtectedRoute.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   └── UserAvatar.jsx
├── context/
│   └── AuthContext.jsx
├── layouts/
│   └── DashboardLayout.jsx
├── pages/
│   ├── AllRequests.jsx
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── MyRequests.jsx
│   ├── PendingApprovals.jsx
│   ├── Register.jsx
│   ├── RequestDetail.jsx
│   └── Unauthorized.jsx
├── services/
│   └── api.js
└── App.jsx
```

### Backend

```
├── controllers/
│   ├── authController.js
│   └── requestController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── AuditLog.js
│   ├── Request.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── requestRoutes.js
├── services/
│   └── auditService.js
├── app.js
├── server.js
└── Dockerfile
```

## 📄 License

MIT License — feel free to use this project as a reference or template.
