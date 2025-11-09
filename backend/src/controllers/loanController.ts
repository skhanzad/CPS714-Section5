import type { Request, Response, NextFunction } from 'express';
import { checkoutSchema, checkinSchema } from '../validators/loanValidators';
import { checkoutItem, checkinItem, getMemberLoans, getMemberFines } from '../services/loanService';

export const checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid checkout payload', issues: parsed.error.flatten() });
    return;
  }
  
  try {
    const loan = await checkoutItem(parsed.data);
    res.status(201).json(loan);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const checkin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = checkinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid checkin payload', issues: parsed.error.flatten() });
    return;
  }
  
  try {
    const result = await checkinItem(parsed.data);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const getLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { memberId } = req.params;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID required' });
    return;
  }
  
  try {
    const loans = await getMemberLoans(memberId);
    res.json(loans);
  } catch (error) {
    next(error);
  }
};

export const getFines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { memberId } = req.params;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID required' });
    return;
  }
  
  try {
    const fines = await getMemberFines(memberId);
    res.json(fines);
  } catch (error) {
    next(error);
  }
};