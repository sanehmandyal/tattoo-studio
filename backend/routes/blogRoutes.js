import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route('/:slugOrId')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

export default router;
