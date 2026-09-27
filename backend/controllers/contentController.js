import SiteContent from '../models/SiteContent.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const getContent = async (req, res) => {
  try {
    const content = await SiteContent.findOne({ section: req.params.section });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const section = req.params.section;
    const existing = await SiteContent.findOne({ section });
    const oldPublicId = existing?.content?.public_id || existing?.content?.cloudinaryId;

    // Safely merge content object if both are objects
    const newContent = (existing?.content && typeof existing.content === 'object' && typeof req.body.content === 'object')
      ? { ...existing.content, ...req.body.content }
      : req.body.content;

    const content = await SiteContent.findOneAndUpdate(
      { section },
      { content: newContent },
      { new: true, upsert: true }
    );

    // Step 6: ONLY AFTER the database update succeeds, delete the old Cloudinary image if replaced
    const newPublicId = newContent?.public_id || newContent?.cloudinaryId;
    if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
      try {
        console.log(`[SiteContent Cleanup] Deleting replaced Cloudinary asset: ${oldPublicId}`);
        await deleteFromCloudinary(oldPublicId);
      } catch (cleanErr) {
        console.warn(`[SiteContent Cleanup] Failed to delete replaced asset ${oldPublicId}:`, cleanErr.message);
      }
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const content = await SiteContent.find();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

