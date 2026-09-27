import Testimonial from '../models/Testimonial.js';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch testimonials: ${error.message}` });
  }
};

export const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch testimonials: ${error.message}` });
  }
};

/**
 * Public testimonial submission by website visitors.
 * Testimonials submitted here are saved with active: false (pending admin review).
 */
export const submitPublicTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ message: 'Name and testimonial content are required' });
    }
    
    let imageUrl = '';
    let cloudinaryId = '';

    const directUrl = req.body.secure_url || req.body.imageUrl;
    const directCloudinaryId = req.body.public_id || req.body.cloudinaryId;

    if (directUrl && directCloudinaryId) {
      imageUrl = directUrl;
      cloudinaryId = directCloudinaryId;
    } else if (req.file) {
      if (isCloudinaryConfigured) {
        console.log(`[Public Testimonial Upload] Processing image (${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'studio-y7/testimonials');
          imageUrl = result.secure_url;
          cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error('[Public Testimonial Upload] Cloudinary upload failed:', uploadError.message || uploadError);
          return res.status(500).json({ message: `Image upload failed: ${uploadError.message || 'Unknown error'}` });
        }
      }
    }

    try {
      const testimonial = await Testimonial.create({
        name: name.trim(),
        role: role ? role.trim() : 'Client',
        content: content.trim(),
        rating: rating ? Math.max(1, Math.min(5, Number(rating))) : 5,
        imageUrl,
        cloudinaryId,
        active: false // Moderation: Unapproved until admin approves
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for sharing your experience! Your review has been submitted and is pending moderation.',
        data: testimonial
      });
    } catch (dbError) {
      if (cloudinaryId) {
        console.error('[Public Testimonial Upload] MongoDB save failed, cleaning up Cloudinary asset:', cloudinaryId);
        await deleteFromCloudinary(cloudinaryId);
      }
      res.status(500).json({ message: `Database save failed: ${dbError.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to submit testimonial: ${error.message || 'Unknown error'}` });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, active } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ message: 'Name and content are required' });
    }
    
    let imageUrl = '';
    let cloudinaryId = '';

    const directUrl = req.body.secure_url || req.body.imageUrl;
    const directCloudinaryId = req.body.public_id || req.body.cloudinaryId;

    if (directUrl) {
      imageUrl = directUrl;
      cloudinaryId = directCloudinaryId || '';
    } else if (req.file) {
      if (isCloudinaryConfigured) {
        console.log(`[Admin Testimonial Upload] Processing testimonial image (${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'studio-y7/testimonials');
          imageUrl = result.secure_url;
          cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error('[Admin Testimonial Upload] Cloudinary upload failed:', uploadError.message || uploadError);
          return res.status(500).json({ message: `Cloudinary upload failed: ${uploadError.message || 'Unknown error'}` });
        }
      }
    }

    try {
      const testimonial = await Testimonial.create({
        name: name.trim(),
        role: role ? role.trim() : 'Client',
        content: content.trim(),
        rating: rating ? Number(rating) : 5,
        imageUrl,
        cloudinaryId,
        active: active !== undefined ? active : true
      });

      res.status(201).json(testimonial);
    } catch (dbError) {
      if (cloudinaryId) {
        console.error('[Admin Testimonial Upload] MongoDB save failed, cleaning up Cloudinary asset:', cloudinaryId);
        await deleteFromCloudinary(cloudinaryId);
      }
      res.status(500).json({ message: `Database save failed: ${dbError.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to create testimonial: ${error.message || 'Unknown error'}` });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: `Failed to update testimonial: ${error.message}` });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    if (testimonial.cloudinaryId) {
      await deleteFromCloudinary(testimonial.cloudinaryId);
    }
    
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete testimonial: ${error.message}` });
  }
};
