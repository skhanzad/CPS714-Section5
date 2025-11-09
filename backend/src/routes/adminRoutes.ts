import { Router } from 'express';
import ensureAdminApiKey from '../middleware/ensureAdminApiKey';
import { approveApplication, listApplicationsHandler } from '../controllers/adminController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.use(ensureAdminApiKey);
router.get('/applications', asyncHandler(listApplicationsHandler));
router.post('/applications/:applicationId/approve', asyncHandler(approveApplication));

export default router;
