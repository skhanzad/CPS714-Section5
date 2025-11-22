CPS714 Section 5 – Inventory Microservice

This project is a backend microservice for managing library inventory
items such as books, laptops, and any RFID‑tagged resources. It provides
a simple REST API for creating items, editing fields, assigning RFID
tags, and handling check‑in/check‑out transactions.

------------------------------------------------------------------------

1. Live API Hosting (Render)
Live URL: https://cps714-section5.onrender.com/
Base API URL: https://cps714-section5.onrender.com/api
Health Check: https://cps714-section5.onrender.com/healthz

Note: Render free tier sleeps after ~15 minutes.
First request may take 10–20 seconds.

------------------------------------------------------------------------

2. Local Development Setup

1.  Clone the repository: git clone
    https://github.com/hasan-khambaty/CPS714-Section5.git cd
    CPS714-Section5/backend

2.  Install dependencies: npm install

3.  Create .env file: MONGO_URI= PORT=3000

4.  Start the server: npm run dev OR npm start

Local API: http://localhost:3000/api

------------------------------------------------------------------------

3. API Overview

Item Endpoints (/api/items)

-   GET /items — List items (supports text search, status filter,
    pagination)
-   POST /items — Create a new inventory item
-   GET /items/:id — Fetch a single item
-   PATCH /items/:id — Update specific item fields
-   DELETE /items/:id — Delete an item
-   POST /items/:id/rfid — Assign or update an RFID tag

Loan Endpoints (/api/loans)

-   POST /checkout — Checkout an item (sets status to CHECKED_OUT)
-   POST /checkin — Checkin an item (sets status to AVAILABLE)

------------------------------------------------------------------------

4. Project Structure

/backend
• Express server
• MongoDB/Mongoose models
• Items controller & routes
• Loans controller & routes

/frontend (if added by team)
• React + Vite client consuming API

------------------------------------------------------------------------

5. Technologies Used

-   Node.js + Express
-   MongoDB + Mongoose
-   Render for deployment
-   Vite (frontend optional)

------------------------------------------------------------------------

6. Team Notes

-   Frontend can switch between local and live API using:
    VITE_API_BASE_URL=

-   All teammates can use the same MongoDB cluster.

-   Keep all major updates submitted via Pull Requests.

------------------------------------------------------------------------

7. License

For academic use only – CPS714 Software Project Management course.
