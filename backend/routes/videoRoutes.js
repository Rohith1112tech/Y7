import express from 'express';
import {
  getAllVideos,
  getAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllVideos);
router.get('/admin', protect, getAdminVideos);
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

export default router;
