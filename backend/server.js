// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import itemRoutes from './src/routes/items.js';
import loanRoutes from './src/routes/loans.js';

// Load env vars (MONGO_URI, PORT, etc.)
dotenv.config();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.use('/api/items', itemRoutes);
app.use('/api/loans', loanRoutes);

// ---------- Serve React frontend build ----------

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the built Vite frontend (run `npm run build` in frontend first)
const frontendPath = path.join(__dirname, '../frontend/dist');

// Serve static files from the React build
app.use(express.static(frontendPath));

// For any non-API route, send back index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------------------------------------

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Inventory API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
