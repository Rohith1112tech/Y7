import Service from '../models/Service.js';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch services: ${error.message}` });
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch services: ${error.message}` });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Service title is required' });
    }

    let packages = [];
    if (req.body.packages) {
      if (typeof req.body.packages === 'string') {
        try {
          packages = JSON.parse(req.body.packages);
        } catch {
          packages = [];
        }
      } else if (Array.isArray(req.body.packages)) {
        packages = req.body.packages;
      }
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
        console.log(`[Service Upload] Processing service image (${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'studio-y7/services');
          imageUrl = result.secure_url;
          cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error('[Service Upload] Cloudinary upload failed:', uploadError.message || uploadError);
          return res.status(500).json({ message: `Cloudinary upload failed: ${uploadError.message || 'Unknown error'}` });
        }
      }
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'A sample image is required for this service' });
    }

    try {
      const service = await Service.create({
        title,
        description: description || '',
        imageUrl,
        cloudinaryId,
        order: order ? Number(order) : 0,
        active: true,
        packages
      });

      res.status(201).json(service);
    } catch (dbError) {
      if (cloudinaryId) {
        console.error('[Service Upload] MongoDB save failed, cleaning up Cloudinary asset:', cloudinaryId);
        await deleteFromCloudinary(cloudinaryId);
      }
      res.status(500).json({ message: `Database save failed: ${dbError.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to create service: ${error.message || 'Unknown error'}` });
  }
};

export const updateService = async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { title, description, order, active } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (order !== undefined) updates.order = Number(order);
    if (active !== undefined) updates.active = active;

    if (req.body.packages !== undefined) {
      if (typeof req.body.packages === 'string') {
        try {
          updates.packages = JSON.parse(req.body.packages);
        } catch {
          updates.packages = [];
        }
      } else if (Array.isArray(req.body.packages)) {
        updates.packages = req.body.packages;
      }
    }

    const directUrl = req.body.secure_url || req.body.imageUrl;
    const directCloudinaryId = req.body.public_id || req.body.cloudinaryId;

    if (directUrl && directUrl !== existing.imageUrl) {
      if (existing.cloudinaryId) {
        await deleteFromCloudinary(existing.cloudinaryId);
      }
      updates.imageUrl = directUrl;
      updates.cloudinaryId = directCloudinaryId || '';
    } else if (req.file) {
      if (isCloudinaryConfigured) {
        const result = await uploadToCloudinary(req.file.buffer, 'studio-y7/services');
        if (existing.cloudinaryId) {
          await deleteFromCloudinary(existing.cloudinaryId);
        }
        updates.imageUrl = result.secure_url;
        updates.cloudinaryId = result.public_id;
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: `Failed to update service: ${error.message}` });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.cloudinaryId) {
      await deleteFromCloudinary(service.cloudinaryId);
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete service: ${error.message}` });
  }
};
