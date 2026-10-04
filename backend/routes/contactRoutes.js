import express from 'express';
import { submitContact, getContacts, updateContactStatus, deleteContact } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, adminOnly, getContacts);

router.route('/:id/status')
  .patch(protect, adminOnly, updateContactStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteContact);

export default router;
