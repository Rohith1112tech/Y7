import express from 'express';
import { getContent, updateContent, getAllContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:section', getContent);
router.put('/:section', protect, updateContent);

export default router;
