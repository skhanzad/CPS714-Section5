import { Router } from 'express';
import ensureAdminApiKey from '../middleware/ensureAdminApiKey';
import { checkout, checkin, getLoans, getFines, listAvailableItems, listAllItems, listActiveLoans } from '../controllers/loanController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Public route - available items catalog
router.get('/items/available', asyncHandler(listAvailableItems));

// Admin routes - require authentication
router.use(ensureAdminApiKey);
router.post('/checkout', asyncHandler(checkout));
router.post('/checkin', asyncHandler(checkin));
router.get('/members/:memberId/loans', asyncHandler(getLoans));
router.get('/members/:memberId/fines', asyncHandler(getFines));
router.get('/items/all', asyncHandler(listAllItems));
router.get('/loans/active', asyncHandler(listActiveLoans));

export default router;