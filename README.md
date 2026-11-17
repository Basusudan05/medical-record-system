# Smart Medical Record Management System

An AI-powered healthcare platform for patients to store, understand, and securely share medical records.

> **For demonstration purposes only. Not clinically validated or production-ready for real patient data.**

---

## Project Structure

```
medical-record-system/
├── frontend/          React + Vite application
├── backend/           Node.js + Express API
├── requirements.md    Software Requirements Specification
├── tasks.md           Development roadmap (Phase 1–11)
└── design.md          UI/UX Design Specification
```

---

## Running the Application

### Backend

```bash
cd backend
cp .env.example .env   # then fill in values as needed
npm install
npm run dev            # development (nodemon)
npm start              # production
```

The API runs on **http://localhost:5000**

Health check: `GET http://localhost:5000/api/health`

### Frontend

```bash
cd frontend
cp .env.example .env   # fill in values as features are implemented
npm install
npm run dev            # development server on http://localhost:5173
npm run build          # production build
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required in Phase |
|---|---|---|
| `PORT` | API port (default 5000) | 1 |
| `NODE_ENV` | `development` or `production` | 1 |
| `FRONTEND_URL` | Frontend origin for CORS | 1 |
| `SUPABASE_URL` | Supabase project URL | 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **never expose to frontend** | 2 |
| `GEMINI_API_KEY` | Gemini API key for AI features | 5 |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to GCP service account JSON | 5 |

### Frontend (`frontend/.env`)

| Variable | Description | Required in Phase |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | 1 |
| `VITE_SUPABASE_URL` | Supabase project URL | 2 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (safe to expose) | 2 |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Lucide React |
| Backend | Node.js, Express 5 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI / OCR | Gemini API, Google Cloud Vision (Phase 5) |
| QR Code | qrcode npm package (Phase 9) |

---

## Implementation Progress

- [x] **Phase 1** — Project setup
- [ ] Phase 2 — Database and authentication
- [ ] Phase 3 — UI development
- [ ] Phase 4 — Document upload
- [ ] Phase 5 — OCR and AI integration
- [ ] Phase 6 — AI verification interface
- [ ] Phase 7 — Medical report analysis
- [ ] Phase 8 — Medical history
- [ ] Phase 9 — QR code sharing
- [ ] Phase 10 — AI medical assistant
- [ ] Phase 11 — Testing and finalization
