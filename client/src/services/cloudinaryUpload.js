import { cloudinaryAPI } from './api.js';

export const MAX_UPLOAD_SIZE = 150 * 1024 * 1024; // 150 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/ogg',
  'video/x-msvideo',
  'video/mov'
];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.mkv', '.ogg', '.avi'];

// Chunk size for Cloudinary chunked uploads: 6 MB (ensures any file > 6 MB is chunked to bypass Cloudinary's 10 MB single-request limit)
const CHUNK_SIZE = 6 * 1024 * 1024;

/**
 * Format bytes into human readable string (KB, MB, GB)
 */
export const formatFileSize = (bytes) => {
  if (!bytes || typeof bytes !== 'number' || isNaN(bytes)) return '0 B';
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
};

/**
 * Validates file format and size for images
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error('No file selected. Please choose an image.');
  }

  const fileName = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  const hasValidMime = ALLOWED_MIME_TYPES.includes((file.type || '').toLowerCase()) || (file.type && file.type.startsWith('image/'));

  if (!hasValidExt && !hasValidMime) {
    throw new Error(`Unsupported file format (${file.type || 'unknown'}). Please choose a JPG, JPEG, PNG, or WEBP image.`);
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error(
      `File size (${formatFileSize(file.size)}) exceeds the 150 MB limit. Maximum image size is 150 MB.`
    );
  }

  return true;
};

/**
 * Validates file format and size for videos
 */
export const validateVideoFile = (file) => {
  if (!file) {
    throw new Error('No file selected. Please choose a video.');
  }

  const fileName = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_VIDEO_EXTENSIONS.some(ext => fileName.endsWith(ext));
  const hasValidMime = ALLOWED_VIDEO_MIME_TYPES.includes((file.type || '').toLowerCase()) || (file.type && file.type.startsWith('video/'));

  if (!hasValidExt && !hasValidMime) {
    throw new Error(`Unsupported video format (${file.type || 'unknown'}). Please choose an MP4, WEBM, MOV, or MKV video.`);
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error(
      `Video size (${formatFileSize(file.size)}) exceeds the 150 MB limit. Maximum video size is 150 MB.`
    );
  }

  return true;
};

/**
 * Generates a unique upload session ID for Cloudinary chunked uploading
 */
const generateUniqueUploadId = (file) => {
  const cleanName = (file.name || 'image').replace(/[^a-zA-Z0-9]/g, '_');
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `y7_${Date.now()}_${randomStr}_${cleanName}`.substring(0, 90);
};

/**
 * Helper to upload a single chunk with retry capability
 */
const uploadChunkWithRetry = ({
  chunk,
  start,
  end,
  totalSize,
  uniqueUploadId,
  uploadUrl,
  signData,
  onProgress,
  signal,
  maxRetries = 3
}) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const executeAttempt = () => {
      if (signal?.aborted) {
        return reject(new Error('Upload was cancelled by user.'));
      }

      attempts++;
      const xhr = new XMLHttpRequest();

      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload was cancelled by user.'));
        });
      }

      xhr.open('POST', uploadUrl, true);

      // Set Cloudinary chunked headers
      const isChunked = totalSize > CHUNK_SIZE;
      if (isChunked) {
        xhr.setRequestHeader('X-Unique-Upload-Id', uniqueUploadId);
        xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${totalSize}`);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(e.loaded);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (parseError) {
            resolve({ status: xhr.status, rawText: xhr.responseText });
          }
        } else {
          let errorMsg = `Cloudinary HTTP ${xhr.status}`;
          try {
            const errJson = JSON.parse(xhr.responseText);
            if (errJson.error?.message) {
              errorMsg = errJson.error.message;
            }
          } catch (e) {}

          // Determine if retryable (e.g., 500, 502, 503, 504, 408, 0)
          const isRetryable = [0, 408, 500, 502, 503, 504].includes(xhr.status) || xhr.status >= 500;
          if (isRetryable && attempts < maxRetries) {
            const delay = Math.pow(2, attempts) * 1000;
            console.warn(`[Cloudinary Chunk Upload] Retry ${attempts}/${maxRetries} after ${delay}ms. Reason: ${errorMsg}`);
            setTimeout(executeAttempt, delay);
          } else {
            reject(new Error(`Cloudinary upload failed: ${errorMsg}`));
          }
        }
      };

      xhr.onerror = () => {
        if (signal?.aborted) {
          return reject(new Error('Upload was cancelled by user.'));
        }
        if (attempts < maxRetries) {
          const delay = Math.pow(2, attempts) * 1000;
          console.warn(`[Cloudinary Chunk Upload] Network error. Retrying ${attempts}/${maxRetries} in ${delay}ms...`);
          setTimeout(executeAttempt, delay);
        } else {
          reject(new Error('Network error during upload to Cloudinary. Please check your internet connection.'));
        }
      };

      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      xhr.send(formData);
    };

    executeAttempt();
  });
};

/**
 * Main Direct Client-Side Cloudinary Upload Service
 * 
 * Supports up to 150MB files using Cloudinary chunked upload.
 * 
 * @param {File} file - Browser File object
 * @param {object} options - Options { folder, onProgress, onStage, signal }
 * @returns {Promise<object>} Cloudinary upload result { secure_url, public_id, ... }
 */
export const uploadDirectToCloudinary = async (file, options = {}) => {
  const {
    folder = 'studio-y7/gallery',
    fileType = 'auto',
    onProgress = () => {},
    onStage = () => {},
    signal = null
  } = options;

  // 1. Validate File
  const isVideo = fileType === 'video' || (file?.type && file.type.startsWith('video/')) || folder.includes('videos');
  if (isVideo) {
    onStage('Validating video file...');
    validateVideoFile(file);
  } else {
    onStage('Validating image file...');
    validateImageFile(file);
  }

  if (signal?.aborted) {
    throw new Error('Upload was cancelled by user.');
  }

  // 2. Fetch Short-Lived Signature from Backend
  onStage('Authenticating with upload service...');
  let signData;
  try {
    const res = await cloudinaryAPI.getSignature(folder);
    signData = res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Failed to authenticate upload signature.';
    throw new Error(`Authentication failure: ${msg}`);
  }

  if (!signData?.signature || !signData?.apiKey || !signData?.cloudName) {
    throw new Error('Invalid signature response received from backend.');
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`;
  const totalSize = file.size;
  const uniqueUploadId = generateUniqueUploadId(file);

  // 3. Single-part or Chunked Upload
  if (totalSize <= CHUNK_SIZE) {
    // Single-part upload
    onStage('Uploading directly to Cloudinary...');
    const result = await uploadChunkWithRetry({
      chunk: file,
      start: 0,
      end: totalSize,
      totalSize,
      uniqueUploadId,
      uploadUrl,
      signData,
      onProgress: (loaded) => {
        const percent = Math.min(100, Math.round((loaded / totalSize) * 100));
        onProgress(percent, { loaded, total: totalSize });
      },
      signal
    });

    onProgress(100, { loaded: totalSize, total: totalSize });
    return result;
  }

  // Large File Chunked Upload (Files > 20 MB up to 150 MB)
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
  let bytesUploadedPreviousChunks = 0;
  let finalResult = null;

  for (let i = 0; i < totalChunks; i++) {
    if (signal?.aborted) {
      throw new Error('Upload was cancelled by user.');
    }

    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalSize);
    const chunkBlob = file.slice(start, end);

    const chunkProgressHandler = (chunkLoaded) => {
      const overallLoaded = bytesUploadedPreviousChunks + chunkLoaded;
      const percent = Math.min(99, Math.round((overallLoaded / totalSize) * 100));
      onProgress(percent, {
        loaded: overallLoaded,
        total: totalSize,
        chunkIndex: i + 1,
        totalChunks
      });
      onStage(`Uploading chunk ${i + 1} of ${totalChunks} (${percent}%)...`);
    };

    const chunkResponse = await uploadChunkWithRetry({
      chunk: chunkBlob,
      start,
      end,
      totalSize,
      uniqueUploadId,
      uploadUrl,
      signData,
      onProgress: chunkProgressHandler,
      signal
    });

    bytesUploadedPreviousChunks += (end - start);

    if (i === totalChunks - 1) {
      finalResult = chunkResponse;
    }
  }

  onProgress(100, { loaded: totalSize, total: totalSize, chunkIndex: totalChunks, totalChunks });
  onStage('Upload complete!');

  if (!finalResult || !finalResult.secure_url) {
    throw new Error('Cloudinary finished chunk upload but did not return asset metadata.');
  }

  return finalResult;
};

/**
 * Transforms a raw Cloudinary URL into a high-fidelity, web-optimized responsive delivery URL.
 * Injects modern next-gen format (f_auto), photography-grade compression (q_auto:best),
 * device pixel ratio sharpness (dpr_auto), and bounds dimensions (c_limit) without upscaling.
 * 
 * @param {string} url - Original image URL
 * @param {object} options - Options { width: 1600, quality: 'auto:best', format: 'auto', dpr: 'auto', crop: 'limit' }
 * @returns {string} Web-optimized delivery URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return '';
  const {
    width = 1600,
    quality = 'auto:best',
    format = 'auto',
    dpr = 'auto',
    crop = 'limit'
  } = options;

  if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
    // Strip any existing transformation segment to allow dynamic responsive sizing and highest quality
    const cleanUrl = url
      .replace(/\/image\/upload\/[^/]*?(c_limit|c_fill|c_scale|f_auto|q_auto)[^/]*?\//, '/image/upload/')
      .replace(/\/auto\/upload\/[^/]*?(c_limit|c_fill|c_scale|f_auto|q_auto)[^/]*?\//, '/auto/upload/');

    const transformParts = [];
    if (crop) transformParts.push(`c_${crop}`);
    if (format) transformParts.push(`f_${format}`);
    if (quality) transformParts.push(`q_${quality}`);
    if (dpr) transformParts.push(`dpr_${dpr}`);
    if (width && width !== 'original') transformParts.push(`w_${width}`);

    const transformStr = transformParts.join(',');

    return cleanUrl.replace('/image/upload/', `/image/upload/${transformStr}/`)
                   .replace('/auto/upload/', `/auto/upload/${transformStr}/`);
  }

  return url;
};

/**
 * Extracts YouTube Video ID from various URL formats
 * (e.g. youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID)
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.trim().match(regExp);
  return match && match[1] ? match[1] : null;
};

/**
 * Generates standard YouTube Embed URL
 */
export const getYouTubeEmbedUrl = (url, options = {}) => {
  const id = extractYouTubeId(url);
  if (!id) return '';
  const { autoplay = 1, rel = 0 } = options;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=${rel}&modestbranding=1&playsinline=1`;
};

/**
 * Gets high-res YouTube Thumbnail poster URL
 */
export const getYouTubeThumbnailUrl = (url) => {
  const id = extractYouTubeId(url);
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

/**
 * Generates optimized delivery URL for Cloudinary Video
 */
export const getOptimizedVideoUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return '';
  const { quality = 'auto', format = 'auto' } = options;

  if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
    const cleanUrl = url
      .replace(/\/video\/upload\/[^/]*?(f_auto|q_auto|vc_auto)[^/]*?\//, '/video/upload/')
      .replace(/\/auto\/upload\/[^/]*?(f_auto|q_auto|vc_auto)[^/]*?\//, '/auto/upload/');

    const transformStr = `f_${format},q_${quality},vc_auto`;
    return cleanUrl.replace('/video/upload/', `/video/upload/${transformStr}/`)
                   .replace('/auto/upload/', `/auto/upload/${transformStr}/`);
  }

  return url;
};

/**
 * Generates video poster thumbnail from Cloudinary video asset or YouTube URL
 */
export const getVideoThumbnailUrl = (video) => {
  if (!video) return '';

  // 1. Explicit thumbnail URL if provided
  if (video.thumbnailUrl) {
    return getOptimizedImageUrl(video.thumbnailUrl, { width: 1200, quality: 'auto:best' });
  }

  // 2. YouTube thumbnail
  if (video.sourceType === 'youtube' || (video.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')))) {
    return getYouTubeThumbnailUrl(video.videoUrl);
  }

  // 3. Cloudinary auto-generated video frame poster (first frame .jpg)
  if (video.videoUrl && (video.videoUrl.includes('res.cloudinary.com') || video.videoUrl.includes('cloudinary.com'))) {
    // Replace file extension with .jpg and add so_0,f_auto,q_auto
    let posterUrl = video.videoUrl.replace(/\.(mp4|webm|mov|mkv|ogg)$/i, '.jpg');
    if (!posterUrl.endsWith('.jpg')) {
      posterUrl = `${posterUrl}.jpg`;
    }
    return posterUrl.replace('/video/upload/', '/video/upload/so_0,f_auto,q_auto:best,c_limit,w_1200/');
  }

  return '';
};

export default {
  uploadDirectToCloudinary,
  validateImageFile,
  validateVideoFile,
  formatFileSize,
  getOptimizedImageUrl,
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getOptimizedVideoUrl,
  getVideoThumbnailUrl,
  MAX_UPLOAD_SIZE,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  ALLOWED_VIDEO_EXTENSIONS,
  ALLOWED_VIDEO_MIME_TYPES
};
