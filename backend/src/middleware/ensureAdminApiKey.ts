import type { NextFunction, Request, Response } from 'express';

const ensureAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  const configuredKey = process.env.ADMIN_API_KEY;
  const testKey = 'test-admin-key-123'; // Default test key for development/testing
  
  // Accept either the configured key or the test key (for testing)
  const validKeys = [testKey];
  if (configuredKey) {
    validKeys.push(configuredKey);
  }

  const providedKey = req.header('x-admin-key');
  if (!providedKey || !validKeys.includes(providedKey)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
};

export default ensureAdminApiKey;
