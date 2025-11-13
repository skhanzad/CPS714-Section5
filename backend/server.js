import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import itemRoutes from './src/routes/items.js';
import loanRoutes from './src/routes/loans.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.use('/api/items', itemRoutes);
app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Inventory API running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err);
  process.exit(1);
});