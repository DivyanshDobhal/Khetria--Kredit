import express from 'express';
import { body } from 'express-validator';
import { 
  createLoanRequest, 
  getMarketplaceLoans, 
  getLoanById, 
  fundLoan 
} from '../controllers/loanController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules
const createLoanValidation = [
  body('amount').isFloat({ min: 2000, max: 100000 }),
  body('purpose').notEmpty().trim().isLength({ min: 10, max: 500 }),
  body('repaymentTerm').isInt({ min: 1, max: 24 })
];

const fundLoanValidation = [
  body('amount').isFloat({ min: 100 })
];

// Routes
router.post('/', authMiddleware, requireRole(['BORROWER']), createLoanValidation, createLoanRequest);
router.get('/', getMarketplaceLoans);
router.get('/:id', getLoanById);
router.post('/:id/fund', authMiddleware, requireRole(['LENDER']), fundLoanValidation, fundLoan);

export default router;
