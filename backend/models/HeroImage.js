import mongoose from 'mongoose';

const heroImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('HeroImage', heroImageSchema);
