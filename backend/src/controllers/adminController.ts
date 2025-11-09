import type { NextFunction, Request, Response } from 'express';
import { approveApplication as approveApplicationService, listApplications } from '../services/adminService';

export const listApplicationsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const applications = await listApplications(status);
    res.json({ applications });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const approveApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { applicationId } = req.params;
  if (!applicationId) {
    res.status(400).json({ message: 'Application id is required' });
    return;
  }

  try {
    const member = await approveApplicationService(applicationId);
    const { pinHash: _ignored, ...sanitized } = member;
    void _ignored;
    res.json({ member: sanitized });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
