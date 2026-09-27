import Video from '../models/Video.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * @route   GET /api/videos
 * @desc    Get all active videos for public website
 * @access  Public
 */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch videos: ${error.message}` });
  }
};

/**
 * @route   GET /api/videos/admin
 * @desc    Get all videos (active and inactive) for admin
 * @access  Private (Admin)
 */
export const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch admin videos: ${error.message}` });
  }
};

/**
 * @route   POST /api/videos
 * @desc    Create a new video / reel
 * @access  Private (Admin)
 */
export const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      sourceType = 'cloudinary',
      videoUrl,
      cloudinaryPublicId,
      thumbnailUrl,
      thumbnailPublicId,
      order,
      active
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Video title is required' });
    }

    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({ message: 'Video URL or uploaded video asset is required' });
    }

    if (!['cloudinary', 'youtube'].includes(sourceType)) {
      return res.status(400).json({ message: 'Invalid video sourceType. Must be cloudinary or youtube.' });
    }

    try {
      const video = await Video.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        sourceType,
        videoUrl: videoUrl.trim(),
        cloudinaryPublicId: cloudinaryPublicId || '',
        thumbnailUrl: thumbnailUrl || '',
        thumbnailPublicId: thumbnailPublicId || '',
        order: order !== undefined ? Number(order) : 0,
        active: active !== undefined ? Boolean(active) : true
      });

      res.status(201).json(video);
    } catch (dbError) {
      if (sourceType === 'cloudinary' && cloudinaryPublicId) {
        console.error('[Video Controller] MongoDB save failed, cleaning up Cloudinary video asset:', cloudinaryPublicId);
        await deleteFromCloudinary(cloudinaryPublicId, 'video');
      }
      if (thumbnailPublicId) {
        await deleteFromCloudinary(thumbnailPublicId, 'image');
      }
      res.status(500).json({ message: `Database save failed: ${dbError.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Failed to create video: ${error.message || 'Unknown error'}` });
  }
};

/**
 * @route   PUT /api/videos/:id
 * @desc    Update an existing video
 * @access  Private (Admin)
 */
export const updateVideo = async (req, res) => {
  try {
    const existing = await Video.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const {
      title,
      description,
      sourceType,
      videoUrl,
      cloudinaryPublicId,
      thumbnailUrl,
      thumbnailPublicId,
      order,
      active
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (sourceType !== undefined) updates.sourceType = sourceType;
    if (order !== undefined) updates.order = Number(order);
    if (active !== undefined) updates.active = Boolean(active);

    // If videoUrl changed and new cloudinaryPublicId is provided
    if (videoUrl !== undefined && videoUrl !== existing.videoUrl) {
      if (existing.sourceType === 'cloudinary' && existing.cloudinaryPublicId && existing.cloudinaryPublicId !== cloudinaryPublicId) {
        await deleteFromCloudinary(existing.cloudinaryPublicId, 'video');
      }
      updates.videoUrl = videoUrl.trim();
      updates.cloudinaryPublicId = cloudinaryPublicId || '';
    }

    // If thumbnail changed
    if (thumbnailUrl !== undefined && thumbnailUrl !== existing.thumbnailUrl) {
      if (existing.thumbnailPublicId && existing.thumbnailPublicId !== thumbnailPublicId) {
        await deleteFromCloudinary(existing.thumbnailPublicId, 'image');
      }
      updates.thumbnailUrl = thumbnailUrl;
      updates.thumbnailPublicId = thumbnailPublicId || '';
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: `Failed to update video: ${error.message}` });
  }
};

/**
 * @route   DELETE /api/videos/:id
 * @desc    Delete a video and remove its Cloudinary video/thumbnail assets if applicable
 * @access  Private (Admin)
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Clean up Cloudinary video asset if source is Cloudinary
    if (video.sourceType === 'cloudinary' && video.cloudinaryPublicId) {
      console.log(`[Video Controller] Deleting Cloudinary video asset: ${video.cloudinaryPublicId}`);
      await deleteFromCloudinary(video.cloudinaryPublicId, 'video');
    }

    // Clean up Cloudinary thumbnail asset if exists
    if (video.thumbnailPublicId) {
      console.log(`[Video Controller] Deleting Cloudinary thumbnail asset: ${video.thumbnailPublicId}`);
      await deleteFromCloudinary(video.thumbnailPublicId, 'image');
    }

    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete video: ${error.message}` });
  }
};
