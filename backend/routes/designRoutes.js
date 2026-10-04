import express from 'express';
import { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign, toggleLikeDesign } from '../controllers/designController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getDesigns)
  .post(protect, adminOnly, createDesign);

router.route('/:id')
  .get(getDesignById)
  .put(protect, adminOnly, updateDesign)
  .delete(protect, adminOnly, deleteDesign);

router.post('/:id/like', toggleLikeDesign);

export default router;
