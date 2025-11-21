import crypto from 'node:crypto';

export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('base64url');
};
