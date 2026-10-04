import express from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/admin', protect, adminOnly, getPublicSettings);
router.put('/', protect, adminOnly, updateSettings);

export default router;
