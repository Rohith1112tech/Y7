import express from 'express';
import { getAllPricing, createPricing, updatePricing, deletePricing } from '../controllers/pricingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPricing);
router.post('/', protect, createPricing);
router.put('/:id', protect, updatePricing);
router.delete('/:id', protect, deletePricing);

export default router;
