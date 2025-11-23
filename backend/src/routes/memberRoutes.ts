import { Router } from 'express';
import { applyForMembership, getApplicationStatus, login, getMemberLoans, getMemberFines } from '../controllers/memberController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/apply', asyncHandler(applyForMembership));
router.get('/applications/:applicationId', asyncHandler(getApplicationStatus));
router.post('/login', asyncHandler(login));
router.get('/:memberId/loans', asyncHandler(getMemberLoans));
router.get('/:memberId/fines', asyncHandler(getMemberFines));

export default router;
