import Availability from '../models/Availability.js';
import Booking from '../models/Booking.js';
import Artist from '../models/Artist.js';

export const getArtistAvailability = async (req, res, next) => {
  try {
    const { artistId, date } = req.query;

    if (!artistId || !date) {
      return res.status(400).json({ success: false, message: 'Please provide artistId and date (YYYY-MM-DD)' });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    // Check day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = new Date(date).getDay();
    const isWorkingDay = artist.workingHours.workingDays.includes(dayOfWeek);

    // Standard studio slot intervals
    const standardSlots = ['11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'];

    if (!isWorkingDay) {
      return res.json({
        success: true,
        date,
        isAvailableDay: false,
        message: 'Artist does not work on this day of the week',
        slots: standardSlots.map(s => ({ time: s, available: false, reason: 'Off-day' }))
      });
    }

    // Check custom blocked dates/holiday
    const blockedRecord = await Availability.findOne({ artist: artistId, date, isBlocked: true });
    if (blockedRecord) {
      return res.json({
        success: true,
        date,
        isAvailableDay: false,
        message: blockedRecord.reason || 'Artist is unavailable on this date',
        slots: standardSlots.map(s => ({ time: s, available: false, reason: blockedRecord.reason }))
      });
    }

    // Find all active bookings on this date for this artist
    const activeBookings = await Booking.find({
      artist: artistId,
      preferredDate: date,
      status: { $in: ['confirmed', 'pending'] }
    }).select('preferredTimeSlot status bookingRef');

    const bookedTimes = activeBookings.map(b => b.preferredTimeSlot);

    const slotList = standardSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time),
      reason: bookedTimes.includes(time) ? 'Booked' : 'Available'
    }));

    res.json({
      success: true,
      artist: { _id: artist._id, name: artist.name },
      date,
      isAvailableDay: true,
      slots: slotList
    });
  } catch (error) {
    next(error);
  }
};

export const blockArtistDate = async (req, res, next) => {
  try {
    const { artistId, date, reason, isBlocked } = req.body;

    const record = await Availability.findOneAndUpdate(
      { artist: artistId, date },
      { isBlocked: isBlocked !== undefined ? isBlocked : true, reason: reason || 'Studio Block' },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Artist schedule updated', record });
  } catch (error) {
    next(error);
  }
};
