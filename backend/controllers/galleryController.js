import Gallery from '../models/Gallery.js';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured, getOptimizedDeliveryUrl } from '../config/cloudinary.js';

export const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch images: ${error.message}` });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { title, category, featured } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    // Direct client-side Cloudinary upload metadata
    const directUrl = req.body.secure_url || req.body.imageUrl;
    const directCloudinaryId = req.body.public_id || req.body.cloudinaryId;

    if (directUrl && directCloudinaryId) {
      console.log(`[Gallery Direct Metadata] Saving: "${title}" (${category}), ID: ${directCloudinaryId}`);

      const image = await Gallery.create({
        title,
        imageUrl: directUrl,
        cloudinaryId: directCloudinaryId,
        category,
        featured: featured === 'true' || featured === true
      });

      console.log(`[Gallery Direct Metadata] Successfully saved to MongoDB (ID: ${image._id})`);
      return res.status(201).json(image);
    }

    // Fallback: If a file was sent via multipart/form-data
    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({
          message: 'Cloudinary is not configured. Please add CLOUDINARY credentials to backend/.env'
        });
      }

      console.log(`[Gallery Server Upload Fallback] Processing: "${title}" (${category}), Size: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB`);
      
      let result;
      try {
        result = await uploadToCloudinary(req.file.buffer, 'studio-y7/gallery');
      } catch (uploadError) {
        console.error('[Gallery Upload] Cloudinary upload failed:', uploadError.message || uploadError);
        return res.status(500).json({ message: `Cloudinary upload failed: ${uploadError.message || 'Unknown error'}` });
      }

      try {
        const image = await Gallery.create({
          title,
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id,
          category,
          featured: featured === 'true' || featured === true
        });

        console.log(`[Gallery Upload] Successfully saved to MongoDB (ID: ${image._id})`);
        return res.status(201).json(image);
      } catch (dbError) {
        console.error('[Gallery Upload] MongoDB save failed, cleaning up Cloudinary asset:', result.public_id);
        await deleteFromCloudinary(result.public_id);
        return res.status(500).json({ message: `Database save failed: ${dbError.message}` });
      }
    }

    return res.status(400).json({ message: 'No image data or file provided for upload.' });
  } catch (error) {
    console.error('[Gallery Upload] Unexpected error:', error.message || error);
    res.status(500).json({ message: `Upload failed: ${error.message || 'Unknown error'}` });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { title, category, featured } = req.body;
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, category, featured: featured === 'true' || featured === true },
      { new: true }
    );
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: `Update failed: ${error.message}` });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.cloudinaryId) {
      await deleteFromCloudinary(image.cloudinaryId);
    }

    await image.deleteOne();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Delete failed: ${error.message}` });
  }
};

export const reorderImages = async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: 'Invalid images array' });
    }
    
    await Promise.all(
      images.map((img, index) => 
        Gallery.findByIdAndUpdate(img.id, { order: index })
      )
    );
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Reorder failed: ${error.message}` });
  }
};

