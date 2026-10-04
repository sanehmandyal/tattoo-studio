import express from 'express';
import { getPortfolio, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio } from '../controllers/portfolioController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPortfolio)
  .post(protect, adminOnly, createPortfolio);

router.route('/:id')
  .get(getPortfolioById)
  .put(protect, adminOnly, updatePortfolio)
  .delete(protect, adminOnly, deletePortfolio);

export default router;
