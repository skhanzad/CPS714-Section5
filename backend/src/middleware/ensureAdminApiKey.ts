import type { NextFunction, Request, Response } from 'express';

const ensureAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey) {
    return res.status(500).json({ message: 'ADMIN_API_KEY is not configured' });
  }

  const providedKey = req.header('x-admin-key');
  if (!providedKey || providedKey !== configuredKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
};

export default ensureAdminApiKey;
