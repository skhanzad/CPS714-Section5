// backend/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import itemRoutes from './src/routes/items.js';
import loanRoutes from './src/routes/loans.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.use('/api/items', itemRoutes);
app.use('/api/loans', loanRoutes);

// ---------- Serve React frontend build (for real usage) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
// ---------------------------------------------------------------

export default app;
