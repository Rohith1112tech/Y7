import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  section: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['hero', 'about', 'services', 'pricing', 'contact']
  },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export default mongoose.model('SiteContent', siteContentSchema);
