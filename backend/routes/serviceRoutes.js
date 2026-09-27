import express from 'express';
import {
  getAllServices,
  getAdminServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { singleImageUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/admin', protect, getAdminServices);
router.post('/', protect, singleImageUpload('image'), createService);
router.put('/:id', protect, singleImageUpload('image'), updateService);
router.delete('/:id', protect, deleteService);

export default router;
