import express from 'express';
import { getActiveHeroImage, uploadHeroImage, deleteHeroImage } from '../controllers/heroController.js';
import { protect } from '../middleware/authMiddleware.js';
import { singleImageUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getActiveHeroImage);
router.post('/', protect, singleImageUpload('image'), uploadHeroImage);
router.delete('/:id', protect, deleteHeroImage);

export default router;
