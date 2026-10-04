import express from 'express';
import { getArtistAvailability, blockArtistDate } from '../controllers/availabilityController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/slots', getArtistAvailability);
router.post('/block', protect, adminOnly, blockArtistDate);

export default router;
