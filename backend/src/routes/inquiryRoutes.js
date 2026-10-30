import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getStats,
} from '../controllers/inquiryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateInquiry } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public Route: Submit Inquiry
router.post('/', validateInquiry, createInquiry);

// Protected Admin Routes (Requires Custom JWT Bearer Token)
router.get('/', authenticateToken, getInquiries);
router.get('/stats', authenticateToken, getStats);
router.patch('/:id/status', authenticateToken, updateInquiryStatus);
router.delete('/:id', authenticateToken, deleteInquiry);

export default router;
