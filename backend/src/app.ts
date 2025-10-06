import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import memberRouter from './routes/memberRoutes';
import adminRouter from './routes/adminRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/members', memberRouter);
app.use('/api/admin', adminRouter);

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

export default app;
