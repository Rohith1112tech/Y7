import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' }
}, { _id: true });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  packages: [packageSchema]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
