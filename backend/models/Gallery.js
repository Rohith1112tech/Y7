import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true }, // Can be Cloudinary ID or local filename
  category: { 
    type: String, 
    enum: ['Wedding', 'Couple', 'Portrait', 'Outdoor', 'Events'],
    required: true 
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
