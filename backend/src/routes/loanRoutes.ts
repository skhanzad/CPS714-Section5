import { Router } from 'express';
import ensureAdminApiKey from '../middleware/ensureAdminApiKey';
import { checkout, checkin, getLoans, getFines } from '../controllers/loanController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();
router.use(ensureAdminApiKey); // All loan routes require admin authentication

router.post('/checkout', asyncHandler(checkout));
router.post('/checkin', asyncHandler(checkin));
router.get('/members/:memberId/loans', asyncHandler(getLoans));
router.get('/members/:memberId/fines', asyncHandler(getFines));

export default router;