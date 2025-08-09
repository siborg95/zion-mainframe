# Railway Deployment Quick Start (NeuroSharp GUI + Server)

## Services
Deploy **two services** from this repo.

### 1) Backend (Node/Express/Mongo)
- **Root Directory:** `server`
- **Start Command:** `npm start`
- **Env Vars:**
  - `MONGO_URI` (your MongoDB connection string)
  - `JWT_SECRET` (long random string)

Health checks now available:
- `/auth/health` → `{ ok: true, scope: "auth" }`
- `/api/health` → `{ ok: true, scope: "api" }`

### 2) Frontend (Vite + Vue)
- **Root Directory:** `/` (repo root)
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run preview -- --host 0.0.0.0 --port $PORT`

Vite `preview` serves the built `dist/` over the Railway-assigned port.

## Notes
- This repo has no Dockerfile/Procfile; Railway auto-detects Node.
- The backend expects a live MongoDB. Set `MONGO_URI` before deploy.
- You can add more API routes under `server/routes/` as required.