import express from 'express';
import { register, login, getMe, updateProfile, toggleSaveDesign, toggleFavoriteArtist, getAllCustomers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/save-design/:designId', protect, toggleSaveDesign);
router.post('/favorite-artist/:artistId', protect, toggleFavoriteArtist);
router.get('/customers', protect, adminOnly, getAllCustomers);

export default router;
