import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://y7studio.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.netlify.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Studio Y7 Backend API is running successfully',
    health: '/api/health',
    frontend: 'https://y7studio.netlify.app'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Studio Y7 API is running' });
});

// Mount routes under both /api/* and /* for full client resilience
const registerRoute = (prefix, router) => {
  app.use(`/api/${prefix}`, router);
  app.use(`/${prefix}`, router);
};

registerRoute('auth', authRoutes);
registerRoute('cloudinary', cloudinaryRoutes);
registerRoute('gallery', galleryRoutes);
registerRoute('hero', heroRoutes);
registerRoute('bookings', bookingRoutes);
registerRoute('contacts', contactRoutes);
registerRoute('testimonials', testimonialRoutes);
registerRoute('content', contentRoutes);
registerRoute('pricing', pricingRoutes);
registerRoute('services', serviceRoutes);
registerRoute('videos', videoRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();

