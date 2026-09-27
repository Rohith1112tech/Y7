import express from 'express';
import { 
  createBooking, 
  getAllBookings, 
  getNewBookingsCount,
  markBookingsAsViewed,
  updateBookingStatus, 
  deleteBooking, 
  createPaymentOrder, 
  verifyPayment 
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, getAllBookings);
router.get('/new/count', protect, getNewBookingsCount);
router.put('/new/mark-viewed', protect, markBookingsAsViewed);
router.put('/:id', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);

export default router;
