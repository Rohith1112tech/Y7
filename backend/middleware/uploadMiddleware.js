import multer from 'multer';
import path from 'path';

// Memory storage for direct streaming to Cloudinary
const storage = multer.memoryStorage();

// Maximum upload size: 150 MB (150 * 1024 * 1024 bytes)
export const MAX_FILE_SIZE = 150 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/i;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /jpeg|jpg|png|webp/i.test(file.mimetype) || file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    const error = new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

/**
 * Express middleware wrapper to catch Multer errors (413 for size limit, 400 for file type)
 * @param {string} fieldName - Form field name for single file upload (default: 'image')
 */
export const singleImageUpload = (fieldName = 'image') => {
  return (req, res, next) => {
    // If incoming request is JSON, skip multer and proceed
    if (req.is('json') || !req.is('multipart/form-data')) {
      return next();
    }

    const uploadSingle = upload.single(fieldName);
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            message: 'File size exceeds 150 MB limit. Maximum allowed image size is 150 MB.'
          });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message || 'File upload failed' });
      }
      next();
    });
  };
};

export default { upload, singleImageUpload, MAX_FILE_SIZE };
