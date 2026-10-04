import Booking from '../models/Booking.js';
import Artist from '../models/Artist.js';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';
import { sendBookingNotification, sendStatusUpdateNotification } from '../services/emailService.js';

export const createBooking = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      artist,
      tattooStyle,
      selectedDesign,
      designRef,
      bodyPlacement,
      approximateSize,
      preferredDate,
      preferredTimeSlot,
      durationMinutes,
      budgetRange,
      additionalNotes,
      referenceImages,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !artist || !tattooStyle || !bodyPlacement || !preferredDate || !preferredTimeSlot) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields' });
    }

    // Verify artist exists
    const artistDoc = await Artist.findById(artist);
    if (!artistDoc || !artistDoc.isActive) {
      return res.status(404).json({ success: false, message: 'Selected artist is currently unavailable' });
    }

    // Check double-booking conflict
    const conflictingBooking = await Booking.findOne({
      artist,
      preferredDate,
      preferredTimeSlot,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: `Artist ${artistDoc.name} is already booked for ${preferredTimeSlot} on ${preferredDate}. Please select another available time slot.`
      });
    }

    const booking = await Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      user: req.user ? req.user._id : null,
      artist,
      tattooStyle,
      selectedDesign: selectedDesign || 'Custom Concept',
      designRef: designRef || null,
      bodyPlacement,
      approximateSize: approximateSize || 'Medium (3-5 inches)',
      preferredDate,
      preferredTimeSlot,
      durationMinutes: durationMinutes || 120,
      budgetRange: budgetRange || '$200 - $500',
      additionalNotes: additionalNotes || '',
      referenceImages: referenceImages || [],
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        updatedAt: new Date(),
        note: 'Appointment request submitted by client',
        updatedBy: customerName,
      }]
    });

    // Populate for response & email
    const populated = await Booking.findById(booking._id).populate('artist', 'name title avatar');

    // Async email notification dispatch
    sendBookingNotification(populated, artistDoc.name).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Your appointment request has been submitted successfully!',
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { status, artist, date, search, page = 1, limit = 25 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (artist && artist !== 'All') {
      query.artist = artist;
    }
    if (date) {
      query.preferredDate = date;
    }
    if (search) {
      query.$or = [
        { bookingRef: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('artist', 'name title avatar')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { user: req.user._id },
        { customerEmail: req.user.email }
      ]
    })
      .populate('artist', 'name title avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('artist')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, internalNotes, note } = req.body;
    const booking = await Booking.findById(req.params.id).populate('artist');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const previousStatus = booking.status;
    if (status) booking.status = status;
    if (internalNotes !== undefined) booking.internalNotes = internalNotes;

    booking.statusHistory.push({
      status: status || previousStatus,
      updatedAt: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user ? req.user.name : 'Admin',
    });

    await booking.save();

    // Trigger email on status transition
    if (status && status !== previousStatus) {
      sendStatusUpdateNotification(booking, note).catch(console.error);
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    next(error);
  }
};

export const rescheduleBooking = async (req, res, next) => {
  try {
    const { preferredDate, preferredTimeSlot, reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('artist');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check conflict
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      artist: booking.artist._id,
      preferredDate,
      preferredTimeSlot,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'The requested reschedule slot is already occupied.'
      });
    }

    booking.preferredDate = preferredDate;
    booking.preferredTimeSlot = preferredTimeSlot;
    booking.rescheduleReason = reason || 'Rescheduled by studio';
    booking.status = 'rescheduled';

    booking.statusHistory.push({
      status: 'rescheduled',
      updatedAt: new Date(),
      note: `Rescheduled to ${preferredDate} at ${preferredTimeSlot}. Reason: ${reason || 'N/A'}`,
      updatedBy: req.user ? req.user.name : 'Admin',
    });

    await booking.save();
    sendStatusUpdateNotification(booking, `Rescheduled to ${preferredDate} at ${preferredTimeSlot}`).catch(console.error);

    res.json({ success: true, message: 'Appointment successfully rescheduled', booking });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    const totalArtists = await Artist.countDocuments({ isActive: true });
    const totalPortfolio = await Portfolio.countDocuments({ isActive: true });
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    const newInquiries = await Contact.countDocuments({ status: 'new' });

    // Recent 7 bookings
    const recentBookings = await Booking.find()
      .populate('artist', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(7);

    // Status breakdown for charts
    const statusDistribution = [
      { name: 'Pending', value: pendingBookings, color: '#E5C07B' },
      { name: 'Confirmed', value: confirmedBookings, color: '#A7835D' },
      { name: 'Completed', value: completedAppointments, color: '#10B981' },
      { name: 'Cancelled', value: cancelledBookings, color: '#EF4444' },
      { name: 'Rejected', value: rejectedBookings, color: '#6B7280' },
    ];

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedAppointments,
        totalArtists,
        totalPortfolio,
        publishedBlogs,
        newInquiries,
        statusDistribution,
        recentBookings,
      }
    });
  } catch (error) {
    next(error);
  }
};
