import { Router } from 'express';
import { applyForMembership, getApplicationStatus, login } from '../controllers/memberController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/apply', asyncHandler(applyForMembership));
router.get('/applications/:applicationId', asyncHandler(getApplicationStatus));
router.post('/login', asyncHandler(login));

export default router;
