import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceTitle: { type: String },
  packageId: { type: String },
  packageName: { type: String },
  packagePrice: { type: String },
  package: { type: String },
  eventType: { type: String },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  message: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Approved', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  isNew: { type: Boolean, default: true },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  paymentId: { type: String },
  // Future ready for notifications
  emailSent: { type: Boolean, default: false },
  whatsappSent: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
