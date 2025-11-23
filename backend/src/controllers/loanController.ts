import type { Request, Response, NextFunction } from 'express';
import { checkoutSchema, checkinSchema } from '../validators/loanValidators';
import { checkoutItem, checkinItem, getMemberLoans, getMemberFines, getAvailableItems, getAllItems, getActiveLoans } from '../services/loanService';

export const checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Debug: log what we received
  console.log('Checkout request body:', req.body);
  console.log('Checkout request headers:', req.headers);
  
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    const errorDetails = parsed.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    res.status(400).json({ 
      message: `Invalid checkout payload: ${errorDetails}`,
      issues: parsed.error.flatten(),
      received: req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : 'no body'
    });
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

export const listAvailableItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await getAvailableItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const listAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const listActiveLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loans = await getActiveLoans();
    res.json(loans);
  } catch (error) {
    next(error);
  }
};