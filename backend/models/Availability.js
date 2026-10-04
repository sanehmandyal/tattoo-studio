import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    default: 'Unavailable',
  },
  customSlots: [{
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }
  }]
}, {
  timestamps: true,
});

availabilitySchema.index({ artist: 1, date: 1 }, { unique: true });

export default mongoose.model('Availability', availabilitySchema);
