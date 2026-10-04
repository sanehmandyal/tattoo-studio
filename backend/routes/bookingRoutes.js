import express from 'express';
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  getDashboardStats,
} from '../controllers/bookingController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/stats', protect, adminOnly, getDashboardStats);

router.get('/', protect, adminOnly, getBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);
router.patch('/:id/reschedule', protect, rescheduleBooking);

export default router;
