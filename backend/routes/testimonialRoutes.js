import express from 'express';
import {
  getAllTestimonials,
  getAdminTestimonials,
  submitPublicTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { singleImageUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTestimonials);
router.post('/submit', singleImageUpload('image'), submitPublicTestimonial);

// Protected Admin routes
router.get('/admin', protect, getAdminTestimonials);
router.post('/', protect, singleImageUpload('image'), createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
