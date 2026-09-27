import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';


let isCloudinaryConfigured = false;

const missingKeys = [];
if (!process.env.CLOUDINARY_CLOUD_NAME) missingKeys.push('CLOUDINARY_CLOUD_NAME');
if (!process.env.CLOUDINARY_API_KEY) missingKeys.push('CLOUDINARY_API_KEY');
if (!process.env.CLOUDINARY_API_SECRET) missingKeys.push('CLOUDINARY_API_SECRET');

if (missingKeys.length === 0) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary configured successfully');
} else {
  console.warn(`⚠️ Cloudinary not fully configured. Missing variable(s): ${missingKeys.join(', ')}`);
}

/**
 * Uploads a memory buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, folder = 'studio-y7/gallery') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      return reject(new Error('Cloudinary is not configured. Please check CLOUDINARY credentials in backend/.env'));
    }

    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error('Invalid image buffer provided for upload'));
    }

    console.log(`☁️ Uploading to Cloudinary [${folder}] (${(buffer.length / 1024).toFixed(1)} KB)...`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error(`❌ Cloudinary upload error in [${folder}]:`, error.message || error);
          return reject(error);
        }
        console.log(`✅ Cloudinary upload success: ${result.secure_url}`);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Transforms a raw Cloudinary URL or public ID into a web-optimized delivery URL.
 * Applies automatic modern format (AVIF/WebP), photography-grade quality (q_auto:best),
 * device pixel ratio adaptation (dpr_auto), and dimension bounds (c_limit) while preserving
 * the master high-resolution asset in Cloudinary.
 * 
 * @param {string} publicIdOrUrl - Cloudinary publicId or full secure_url
 * @param {object} options - Options { width: 2560, quality: 'auto:best', format: 'auto' }
 * @returns {string} Web-optimized delivery URL
 */
export const getOptimizedDeliveryUrl = (publicIdOrUrl, options = {}) => {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== 'string') return '';
  const { width = 2560, quality = 'auto:best', format = 'auto' } = options;

  if (publicIdOrUrl.includes('res.cloudinary.com') || publicIdOrUrl.includes('cloudinary.com')) {
    // Strip existing transformation segment if present to avoid chaining or degraded quality
    const cleanUrl = publicIdOrUrl
      .replace(/\/image\/upload\/[^/]*?(c_limit|f_auto|q_auto)[^/]*?\//, '/image/upload/')
      .replace(/\/auto\/upload\/[^/]*?(c_limit|f_auto|q_auto)[^/]*?\//, '/auto/upload/');
    
    const transforms = `c_limit,f_${format},q_${quality},dpr_auto,w_${width}`;
    return cleanUrl.replace('/image/upload/', `/image/upload/${transforms}/`)
                   .replace('/auto/upload/', `/auto/upload/${transforms}/`);
  }

  if (isCloudinaryConfigured) {
    return cloudinary.url(publicIdOrUrl, {
      fetch_format: format,
      quality,
      dpr: 'auto',
      crop: 'limit',
      width,
      secure: true
    });
  }

  return publicIdOrUrl;
};

/**
 * Deletes an asset from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 * @returns {Promise<object|null>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!isCloudinaryConfigured || !publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary destroy error:', error.message);
    return null;
  }
};

/**
 * Generates a signed Cloudinary upload signature for client-side uploads.
 * Ensures the API secret remains strictly on the backend.
 * 
 * @param {string} folder - Target Cloudinary folder (e.g. 'studio-y7/gallery')
 * @param {object} customParams - Additional optional parameters to sign
 * @returns {object} { signature, timestamp, apiKey, cloudName, folder }
 */
export const generateUploadSignature = (folder = 'studio-y7/gallery', customParams = {}) => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured on the backend. Check .env');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder,
    ...customParams
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder
  };
};

export { cloudinary, isCloudinaryConfigured };
export default cloudinary;
