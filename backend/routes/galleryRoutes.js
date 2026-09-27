import express from 'express';
import { getAllImages, uploadImage, updateImage, deleteImage, reorderImages } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { singleImageUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllImages);
router.post('/', protect, singleImageUpload('image'), uploadImage);
router.put('/:id', protect, updateImage);
router.delete('/:id', protect, deleteImage);
router.put('/reorder/all', protect, reorderImages);

export default router;
