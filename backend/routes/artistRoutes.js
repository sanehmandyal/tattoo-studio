import express from 'express';
import { getArtists, getArtistBySlug, createArtist, updateArtist, deleteArtist } from '../controllers/artistController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getArtists)
  .post(protect, adminOnly, createArtist);

router.route('/:slugOrId')
  .get(getArtistBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateArtist)
  .delete(protect, adminOnly, deleteArtist);

export default router;
