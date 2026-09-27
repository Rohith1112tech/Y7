import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';

// Initialize Razorpay only if credentials are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

export const createBooking = async (req, res) => {
  try {
    const bookingData = { ...req.body };
    if (!bookingData.eventType && bookingData.serviceTitle) {
      bookingData.eventType = bookingData.serviceTitle;
    }
    if (!bookingData.serviceTitle && bookingData.eventType) {
      bookingData.serviceTitle = bookingData.eventType;
    }
    if (!bookingData.package && bookingData.packageName) {
      bookingData.package = bookingData.packageName;
    }
    if (!bookingData.packageName && bookingData.package) {
      bookingData.packageName = bookingData.package;
    }
    if (!bookingData.message && bookingData.notes) {
      bookingData.message = bookingData.notes;
    }
    const booking = await Booking.create(bookingData);
    
    // Future ready: Send notifications here
    // await sendEmailNotification(booking);
    // await sendWhatsAppNotification(booking);
    // await sendSMSNotification(booking);
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewBookingsCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ isNew: true });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markBookingsAsViewed = async (req, res) => {
  try {
    await Booking.updateMany({ isNew: true }, { isNew: false });
    res.json({ message: 'Bookings marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, isNew: false },
      { new: true }
    );
    
    // Future ready: Send status update notification
    // if (req.body.status === 'Confirmed') {
    //   await sendConfirmationNotification(booking);
    // }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(400).json({ message: 'Razorpay not configured' });
    }
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentId } = req.body;
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'Completed',
      paymentId
    });
    res.json({ message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
