import HeroImage from '../models/HeroImage.js';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured, getOptimizedDeliveryUrl } from '../config/cloudinary.js';

export const getActiveHeroImage = async (req, res) => {
  try {
    const hero = await HeroImage.findOne({ active: true }).sort({ createdAt: -1 });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadHeroImage = async (req, res) => {
  try {
    const directUrl = req.body.secure_url || req.body.imageUrl;
    const directCloudinaryId = req.body.public_id || req.body.cloudinaryId;

    // Direct client-side Cloudinary upload
    if (directUrl && directCloudinaryId) {
      console.log(`[Hero Direct Metadata] Setting new active hero image, ID: ${directCloudinaryId}`);

      // Step 1: Create new active hero image first
      const newHero = await HeroImage.create({
        imageUrl: directUrl,
        cloudinaryId: directCloudinaryId,
        active: true
      });

      // Step 2: Only once new hero is confirmed in DB, deactivate old heroes
      await HeroImage.updateMany({ _id: { $ne: newHero._id } }, { active: false });

      console.log(`[Hero Direct Metadata] Successfully activated new hero image (ID: ${newHero._id})`);
      return res.status(201).json(newHero);
    }

    // Fallback: If a file was sent via multipart/form-data
    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({
          message: 'Cloudinary is not configured. Please add CLOUDINARY credentials to backend/.env'
        });
      }

      console.log(`[Hero Server Upload Fallback] Processing hero image, Size: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB`);

      let result;
      try {
        result = await uploadToCloudinary(req.file.buffer, 'studio-y7/hero');
      } catch (uploadError) {
        console.error('[Hero Upload] Cloudinary upload failed:', uploadError.message || uploadError);
        return res.status(500).json({ message: `Cloudinary upload failed: ${uploadError.message || 'Unknown error'}` });
      }

      try {
        const newHero = await HeroImage.create({
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id,
          active: true
        });

        await HeroImage.updateMany({ _id: { $ne: newHero._id } }, { active: false });

        console.log(`[Hero Upload] Successfully saved new active hero image to MongoDB (ID: ${newHero._id})`);
        return res.status(201).json(newHero);
      } catch (dbError) {
        console.error('[Hero Upload] MongoDB save failed, cleaning up Cloudinary asset:', result.public_id);
        await deleteFromCloudinary(result.public_id);
        return res.status(500).json({ message: `Database save failed: ${dbError.message}` });
      }
    }

    return res.status(400).json({ message: 'No hero image data or file provided for upload.' });
  } catch (error) {
    console.error('[Hero Upload] Unexpected error:', error.message || error);
    res.status(500).json({ message: `Hero image upload failed: ${error.message || 'Unknown error'}` });
  }
};

export const deleteHeroImage = async (req, res) => {
  try {
    const hero = await HeroImage.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero image not found' });
    }
    if (hero.cloudinaryId) {
      await deleteFromCloudinary(hero.cloudinaryId);
    }
    await hero.deleteOne();
    res.json({ message: 'Hero image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

