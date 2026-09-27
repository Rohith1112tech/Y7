import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateUploadSignature, isCloudinaryConfigured } from '../config/cloudinary.js';

const router = express.Router();

const ALLOWED_FOLDERS = [
  'studio-y7/gallery',
  'studio-y7/hero',
  'studio-y7/testimonials',
  'studio-y7/services',
  'studio-y7/about',
  'studio-y7/videos',
  'studio-y7/video-thumbnails'
];

/**
 * @route   POST /api/cloudinary/signature
 * @desc    Generate a signed Cloudinary upload signature for client-side upload
 * @access  Private (Admin only)
 */
router.post('/signature', protect, (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        message: 'Cloudinary is not configured. Please check backend environment variables.'
      });
    }

    const { folder = 'studio-y7/gallery' } = req.body;

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return res.status(400).json({
        message: `Invalid folder specified. Allowed folders: ${ALLOWED_FOLDERS.join(', ')}`
      });
    }

    const signatureData = generateUploadSignature(folder);
    res.json(signatureData);
  } catch (error) {
    console.error('[Cloudinary Signature] Error generating signature:', error.message);
    res.status(500).json({ message: `Signature generation failed: ${error.message}` });
  }
});

export default router;
