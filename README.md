# LibraLite Hold/Reservation System (Section 5, Team 3)
In this branch (team-3-reservations), we implement features associated with the Holds/Reservations.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (included with Node.js)
- Firebase project with Firestore database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/skhanzad/CPS714-Section5.git
   cd CPS714-Section5
   git checkout team-3-reservations
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a `.env.local` file in the root directory
   - Add your Firebase configuration:
     ```env
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_CLIENT_EMAIL=your_client_email
     FIREBASE_PRIVATE_KEY=your_private_key
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.


## Holds/Reservations API

### 1. Place a Hold
- **Endpoint:** `POST /api/holds`
- **Description:** Allows a member to place a hold on a checked-out item.
- **Request Body:**
  ```json
  {
    "itemId": "string",
    "libraryCardNumber": "string",
    "memberName": "string",
    "memberEmail": "string"
  }
  ```
- **Logic:**
  - Verifies item exists and is currently checked out.
  - Checks for existing holds by the same user.
  - Assigns a queue position based on existing active holds.

### 2. Get Holds
- **Endpoint:** `GET /api/holds`
- **Description:** Retrieves a list of holds based on query parameters.
- **Query Parameters:**
  - `libraryCardNumber` (optional): Filter by member.
  - `itemId` (optional): Filter by item.
  - `status` (optional): Filter by hold status (e.g., 'active', 'ready').

### 3. Get Single Hold
- **Endpoint:** `GET /api/holds/[id]`
- **Description:** Retrieves details of a specific hold by its ID.

### 4. Update Hold Status
- **Endpoint:** `PATCH /api/holds/[id]`
- **Description:** Updates the status of a hold.
- **Request Body:**
  ```json
  {
    "status": "string" // e.g., 'ready', 'fulfilled'
  }
  ```
- **Logic:**
  - Updates status and timestamps (`readyAt`, `fulfilledAt`, etc.).
  - If status is 'ready', sets expiration date to 7 days from now.

### 5. Place Item on Hold Shelf
- **Endpoint:** `POST /api/hold-shelf`
- **Description:** Processes an item return and places it on the hold shelf for the next member in the queue.
- **Request Body:**
  ```json
  {
    "itemId": "string"
  }
  ```
- **Logic:**
  - Identifies the next active hold for the item.
  - Updates hold status to 'ready'.
  - Creates a record in the `holdShelf` collection.
  - Updates item status to indicate it is on the hold shelf.

### 6. Get Hold Shelf Items
- **Endpoint:** `GET /api/hold-shelf`
- **Description:** Retrieves items currently on the hold shelf.
- **Query Parameters:**
  - `libraryCardNumber` (optional): Filter by member.