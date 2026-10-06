import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import designRoutes from './routes/designRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import aftercareRoutes from './routes/aftercareRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // max 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import mongoose from 'mongoose';
import { getDbInfo } from './config/db.js';

// Health Check API (both /api/health and /health)
const healthHandler = (req, res) => {
  const dbInfo = getDbInfo();
  res.json({
    status: 'online',
    database: dbInfo.status,
    dbHost: dbInfo.host,
    isPersistent: dbInfo.isPersistent,
    storageType: dbInfo.type,
    whitelistRequired: dbInfo.whitelistRequired,
    timestamp: new Date().toISOString(),
    service: 'LAND OF GOD Tattoo Studio API',
    version: '1.0.0'
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/', healthHandler);

// Mount Routes on /api/* prefix
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/aftercare', aftercareRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Fallback: Also Mount directly on root /* so requests without /api prefix never 404
app.use('/auth', authRoutes);
app.use('/artists', artistRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/designs', designRoutes);
app.use('/bookings', bookingRoutes);
app.use('/availability', availabilityRoutes);
app.use('/blogs', blogRoutes);
app.use('/contact', contactRoutes);
app.use('/settings', settingsRoutes);
app.use('/aftercare', aftercareRoutes);
app.use('/reviews', reviewRoutes);
app.use('/upload', uploadRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
