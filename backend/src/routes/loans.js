import express from 'express';
import { checkout, checkin } from '../controllers/itemController.js';
const router = express.Router();
router.post('/checkout', checkout);
router.post('/checkin', checkin);
export default router;