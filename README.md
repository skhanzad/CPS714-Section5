# LibraLite Access Control Service

Member registration and authentication stack for the Springfield Public Library modernization project. The repository hosts two deployable units:

- `backend` — Express + TypeScript API that integrates with Firebase Admin / Firestore for persistence.
- `frontend` — Vite + React TypeScript client for resident self-service (apply, login, track status).

## Features Delivered (Task 1)

- Online member application workflow with validation and duplicate checks.
- Secure PIN handling (bcrypt hashing) and library card authentication endpoint.
- Librarian review APIs guarded by an admin key for listing and approving applicants.
- React client with application, login, and status-check screens wired to the API.

## Project Structure

```
/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts               # Express app wiring and middleware
│  │  ├─ server.ts            # Entry point (loads env then starts server)
│  │  ├─ config/firebase.ts   # Firebase Admin bootstrap
│  │  ├─ controllers/         # HTTP handlers (member + admin)
│  │  ├─ services/            # Business logic + Firestore access
│  │  ├─ utils/               # Helpers (IDs, hashing, mapping)
│  │  └─ validators/          # Zod input validation schemas
│  ├─ tsconfig.json
│  ├─ package.json
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ pages/               # React screens for apply/login/status
   │  ├─ routes/router.tsx    # SPA routing
   │  ├─ layout/RootLayout.tsx
   │  └─ lib/api.ts           # REST client wrapper
   ├─ tsconfig*.json
   ├─ package.json
   └─ .env.example
```

## Prerequisites

- Node.js 20.19+ (aligns with the Firebase Admin SDK engine requirement).
- npm 10+, pnpm, or yarn. When working inside WSL ensure you use the Linux toolchain to avoid UNC path issues with npm scripts.
- A Firebase project with service-account credentials and Firestore enabled.

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env` and populate:
   - `PORT` — API port (default 4000).
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — service account fields. Private key must retain newline escapes.
   - `ADMIN_API_KEY` — random string used in the `x-admin-key` header for librarian routes.
2. Install dependencies: `cd backend && npm install` (or `pnpm install`).
3. Start the API:
   - Dev with reload: `npm run dev`.
   - Production build: `npm run build` then `npm start`.
4. Available endpoints:
   - `POST /api/members/apply` — submit application.
   - `GET /api/members/applications/:applicationId` — check status.
   - `POST /api/members/login` — member login (approved only).
   - `GET /api/admin/applications?status=pending` — list applications (requires `x-admin-key`).
   - `POST /api/admin/applications/:applicationId/approve` — approve + issue card (requires `x-admin-key`).

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the backend base URL.
2. Install dependencies: `cd frontend && npm install`.
3. Run `npm run dev` for local development (default http://localhost:5173).
4. The SPA ships with three primary flows: apply, login, and status check. React Query is pre-configured for future data-fetching enhancements.

## Next Steps for the Team

1. **Approval UI:** Build staff dashboard components that call the admin endpoints and surface status metrics (ties into Sub-project 7).
2. **Session Management:** Persist session tokens server-side (e.g., Redis) and issue HTTP-only cookies.
3. **Audit Trail:** Record approval decisions and email notifications in Firestore collections to support compliance.
4. **Form Enhancements:** Add richer validation, address autocomplete, and PIN strength checks as requirements mature.
5. **CI Setup:** Wire linting (`npm run lint`) and TypeScript checks into your CI pipeline once dependencies are installed.

## Troubleshooting

- If npm warns about UNC paths under WSL, install and run Node directly inside the Linux environment (`nvm install 20 && nvm use 20`).
- Firestore security: ensure the service account used here has restricted roles scoped to Firestore access.
- For local admin tests, set the `x-admin-key` header in tools such as Hoppscotch or Postman to match `ADMIN_API_KEY`.
