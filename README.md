# LibraLite Access Control Service

Member registration and authentication stack for the Springfield Public Library modernization project. The repository hosts two deployable units:

## Recent Changes

### Loan Management System (Latest Update)
- **Staff Checkout/Check-in Interface**: Complete staff interface for processing item checkouts and returns with member and item selection
- **Public Item Catalog**: Browse available items with filtering by type (books, DVDs, magazines, other)
- **Member Account Portal**: Self-service portal for members to view loans, fines, and potential late fees
- **Late Fee Calculator Tool**: Public utility for calculating hypothetical late fees based on item type and return date
- **Due Date Automation**: Automatic due date calculation based on item type with configurable loan periods
- **Late Fee Automation**: Automatic late fee calculation on check-in at $0.50 per day overdue
- **Database Seeding**: Automated script to populate database with sample items and loan records for development and testing
- **Unit Test Suite**: Comprehensive test coverage with 22 unit tests covering critical business logic including due date calculations, late fee calculations, and input validation
- **API Enhancements**: Extended REST API with new endpoints for loan management, item catalog access, and member data retrieval

- `backend` — Express + TypeScript API that integrates with Firebase Admin / Firestore for persistence.
- `frontend` — Vite + React TypeScript client for resident self-service (apply, login, track status).

## Features Delivered

### Core Features (Task 1)
- Online member application workflow with validation and duplicate checks.
- Secure PIN handling (bcrypt hashing) and library card authentication endpoint.
- Librarian review APIs guarded by an admin key for listing and approving applicants.
- React client with application, login, and status-check screens wired to the API.

### Loan Management Features
- **Checkout Module**: Staff interface for processing item checkouts by scanning item and member IDs.
- **Check-in Module**: Staff interface for processing returns by scanning item IDs with automatic late fee calculation.
- **Due Date Calculator**: Automated logic to determine return dates based on item type:
  - Books: 3 weeks (21 days)
  - DVDs: 1 week (7 days)
  - Magazines: 2 weeks (14 days)
  - Other: 2 weeks (14 days)
- **Late Fee Calculator**: Automated calculation of fines based on overdue status ($0.50 per day).
- **Public Catalog**: Browse all available items with filtering by type.
- **Member Account Page**: Members can view their loans, fines, and potential late fees by entering their library card number.
- **Late Fee Calculator Tool**: Public tool to calculate hypothetical late fees for items.

## Project Structure

```
/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts               # Express app wiring and middleware
│  │  ├─ server.ts            # Entry point (loads env then starts server)
│  │  ├─ config/firebase.ts   # Firebase Admin bootstrap
│  │  ├─ controllers/         # HTTP handlers (member + admin + loan)
│  │  ├─ services/            # Business logic + Firestore access
│  │  ├─ utils/               # Helpers (IDs, hashing, mapping, loan calculations)
│  │  ├─ validators/          # Zod input validation schemas
│  │  ├─ scripts/             # Database seeding scripts
│  │  └─ __tests__/           # Unit tests
│  ├─ tsconfig.json
│  ├─ package.json
│  ├─ vitest.config.ts        # Test configuration
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ pages/               # React screens (apply, login, status, catalog, staff, calculator, account)
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
4. Seed the database with dummy data (optional):
   - Run `npm run seed` to populate the database with sample items and loans.
5. Run tests:
   - `npm test` — run all unit tests
   - `npm run test:watch` — run tests in watch mode
6. Available endpoints:
   - **Member Endpoints:**
     - `POST /api/members/apply` — submit application
     - `GET /api/members/applications/:applicationId` — check status
     - `POST /api/members/login` — member login (approved only)
     - `GET /api/members/:memberId/loans` — get member's loans (public)
     - `GET /api/members/:memberId/fines` — get member's fines (public)
   - **Admin Endpoints** (require `x-admin-key` header):
     - `GET /api/admin/applications?status=pending` — list applications
     - `POST /api/admin/applications/:applicationId/approve` — approve + issue card
     - `GET /api/admin/members` — list all approved members
   - **Loan Endpoints:**
     - `GET /api/loans/items/available` — list available items (public)
     - `POST /api/loans/checkout` — checkout item (requires `x-admin-key`)
     - `POST /api/loans/checkin` — checkin item (requires `x-admin-key`)
     - `GET /api/loans/items/all` — list all items (requires `x-admin-key`)
     - `GET /api/loans/loans/active` — list active loans (requires `x-admin-key`)
     - `GET /api/loans/members/:memberId/loans` — get member loans (requires `x-admin-key`)
     - `GET /api/loans/members/:memberId/fines` — get member fines (requires `x-admin-key`)

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the backend base URL.
2. Install dependencies: `cd frontend && npm install`.
3. Run `npm run dev` for local development (default http://localhost:5173).

## Frontend Pages

The application includes the following pages:

- **Landing Page** (`/`) — Main entry point with links to all features
- **Apply Page** (`/apply`) — Submit a library card application
- **Login Page** (`/login`) — Member login with library card number and PIN
- **Pending Page** (`/pending`) — Check application status
- **My Account** (`/account`) — View loans, fines, and potential late fees (enter library card number)
- **Catalog** (`/catalog`) — Browse available items with filtering by type
- **Late Fee Calculator** (`/calculator`) — Calculate hypothetical late fees
- **Staff Checkout/Check-in** (`/staff`) — Staff interface for processing checkouts and check-ins

## Testing

### Unit Tests

The project includes unit tests for critical business logic:

- **Due Date Calculator Tests** — Verify correct due date calculation for different item types
- **Late Fee Calculator Tests** — Verify correct late fee calculation for various scenarios
- **Validator Tests** — Verify input validation for checkout and checkin operations

Run tests with:
```bash
cd backend
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

Test coverage includes:
- 12 tests for loan utilities (due dates and late fees)
- 10 tests for input validators
- Total: 22 passing tests

## Database Seeding

To populate the database with sample data for testing:

```bash
cd backend
npm run seed
```

This will create:
- 17 sample items (books, DVDs, magazines, and other items)
- 5 sample loans (some checked out, some overdue)
- Links loans to existing members in the database

**Prerequisites**: The seed script requires at least one approved member record to exist in the database. If no members exist, items will be created successfully, but loan records will not be generated.

## Key Features Documentation

### Checkout Process

The checkout workflow operates as follows:

1. Staff authentication: Staff members access the checkout interface at `/staff` and confirm staff status
2. Member selection: Staff selects a member from a dropdown interface displaying library card number and member name
3. Item selection: Staff selects an item from the available items list or manually enters an item identifier
4. Transaction processing: Upon checkout initiation, the system executes the following operations:
   - Validates member existence and approval status
   - Validates item existence and availability status
   - Creates a loan record with automatically calculated due date based on item type
   - Updates item availability status to unavailable

### Check-in Process

The check-in workflow operates as follows:

1. Staff authentication: Staff members access the check-in interface via the staff portal
2. Loan identification: Staff selects a loan from the active loans list or manually enters loan identifier and item identifier
3. Transaction processing: Upon check-in initiation, the system executes the following operations:
   - Validates loan existence and item-loan association
   - Calculates late fees if the return date exceeds the due date
   - Updates loan status to returned or overdue based on return timing
   - Creates a fine record if applicable
   - Updates item availability status to available

### Due Date Calculation

Due dates are automatically calculated based on item type:
- **Books**: Checkout date + 21 days (3 weeks)
- **DVDs**: Checkout date + 7 days (1 week)
- **Magazines**: Checkout date + 14 days (2 weeks)
- **Other**: Checkout date + 14 days (2 weeks)

### Late Fee Calculation

Late fees are calculated as:
- **Rate**: $0.50 per day
- **Calculation**: Days overdue × $0.50
- **Rounding**: Rounded to 2 decimal places
- **No fee**: If returned on or before due date

### Member Account Features

The member account portal provides self-service access to account information:

- **Access Method**: Members navigate to `/account` and authenticate using their library card number
- **Available Information**:
  - Complete loan history including active and historical loans
  - Outstanding fine balances and payment status
  - Projected late fees for currently checked-out items based on hypothetical return dates
  - Due date information with calculated days remaining or days overdue

## API Authentication

### Public Endpoints
- Member application and status checking
- Member login
- Viewing member loans and fines (with member ID)
- Browsing available items catalog

### Protected Endpoints (Admin Key Required)
All admin and loan management endpoints require the `x-admin-key` header:
```
x-admin-key: your-admin-api-key
```

**Development Testing**: The system accepts a default test key `test-admin-key-123` when no `ADMIN_API_KEY` is configured in the backend environment configuration. This default key should not be used in production environments.

## Recommended Future Enhancements

The following enhancements are recommended for production deployment and operational excellence:

1. **Analytics and Reporting Dashboard**: Implement comprehensive metrics, operational reports, and analytics capabilities for library management and decision-making
2. **Session Management Infrastructure**: Implement server-side session token persistence (e.g., Redis) with HTTP-only cookie distribution for enhanced security
3. **Audit Logging System**: Implement comprehensive audit trail functionality to record all checkout, check-in, and administrative actions in Firestore for compliance and accountability
4. **Automated Notification System**: Implement email notification service for due date reminders, overdue notices, and account status updates
5. **Payment Processing Integration**: Implement fine payment processing, payment tracking, and receipt generation capabilities
6. **Item Management Interface**: Develop administrative interface for staff to create, update, and delete catalog items
7. **Continuous Integration/Continuous Deployment**: Integrate automated linting (`npm run lint`), testing (`npm test`), and TypeScript compilation checks into CI/CD pipeline

## Troubleshooting

### Common Issues and Resolutions

1. **Firestore Index Errors**
   - **Symptom**: "FAILED_PRECONDITION: The query requires an index" error messages
   - **Resolution**: The codebase has been updated to avoid composite index requirements by implementing in-memory sorting. Restart the server to apply changes.

2. **401 Unauthorized Errors**
   - **Symptom**: Authentication failures on protected endpoints
   - **Resolution**: 
     - For development: System accepts `test-admin-key-123` as default admin key
     - For production: Configure `ADMIN_API_KEY` in backend environment variables
     - Verify `x-admin-key` header is included in all protected endpoint requests

3. **400 Bad Request - Invalid Payload**
   - **Symptom**: Validation errors on request payloads
   - **Resolution**:
     - Verify all required fields are provided (memberId and itemId for checkout; loanId and itemId for checkin)
     - Ensure memberId meets minimum length requirement of 5 characters
     - Ensure itemId meets minimum length requirement of 1 character
     - Verify request body is properly formatted as JSON with correct Content-Type header

4. **No Available Items**
   - **Symptom**: Empty catalog or no items available for checkout
   - **Resolution**:
     - Execute `npm run seed` in backend directory to populate sample data
     - Verify items exist in Firestore collection with `isAvailable: true` status

5. **WSL/UNC Path Issues**
   - **Symptom**: npm warnings regarding UNC paths in Windows Subsystem for Linux
   - **Resolution**: Install and execute Node.js directly within the Linux environment using `nvm install 20 && nvm use 20`

6. **Firestore Security Configuration**
   - **Symptom**: Authentication or permission errors with Firestore
   - **Resolution**:
     - Verify service account has appropriate restricted roles scoped to Firestore access
     - Validate Firebase service account credentials are correctly configured in environment variables

### Testing API Endpoints

For local admin tests, use tools like Hoppscotch or Postman:
- Set the `x-admin-key` header to `test-admin-key-123` (for testing) or your configured `ADMIN_API_KEY`
- Set `Content-Type: application/json` header
- Include request body as JSON for POST requests

### Database Collections

The application uses the following Firestore collections:
- `memberApplications` — Pending member applications
- `members` — Approved members with library cards
- `items` — Library items (books, DVDs, magazines, etc.)
- `loans` — Active and historical loans
- `fines` — Outstanding and paid fines
