import express from 'express';
import { 
  getMyLoans, 
  getMyInvestments, 
  getDashboardStats 
} from '../controllers/dashboardController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Routes
router.get('/my-loans', requireRole(['BORROWER']), getMyLoans);
router.get('/my-investments', requireRole(['LENDER']), getMyInvestments);
router.get('/stats', getDashboardStats);

export default router;
