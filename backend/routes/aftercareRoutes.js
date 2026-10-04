import express from 'express';
import { getAftercare, createAftercare, updateAftercare, deleteAftercare } from '../controllers/aftercareController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAftercare)
  .post(protect, adminOnly, createAftercare);

router.route('/:id')
  .put(protect, adminOnly, updateAftercare)
  .delete(protect, adminOnly, deleteAftercare);

export default router;
