import type { NextFunction, Request, Response } from 'express';
import { applicationSchema, applicationIdSchema, loginSchema } from '../validators/memberValidators';
import { submitApplication, getApplication, authenticateMember } from '../services/memberService';
import { generateSessionToken } from '../utils/session';

export const applyForMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid application payload', issues: parsed.error.flatten() });
    return;
  }

  try {
    const application = await submitApplication(parsed.data);
    res.status(201).json({ id: application.id, status: application.status });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const getApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = applicationIdSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid application id' });
    return;
  }

  try {
    const { applicationId } = parsed.data;
    const application = await getApplication(applicationId);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  try {
    const member = await authenticateMember(parsed.data);
    const { pinHash: _ignored, ...sanitized } = member;
    void _ignored;
    const token = generateSessionToken();
    res.json({ token, member: sanitized });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
