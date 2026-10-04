import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    unique: true,
    index: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Please select a preferred artist'],
  },
  tattooStyle: {
    type: String,
    required: [true, 'Tattoo style is required'],
  },
  selectedDesign: {
    type: String,
    default: 'Custom Concept',
  },
  designRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TattooDesign',
    default: null,
  },
  bodyPlacement: {
    type: String,
    required: [true, 'Body placement is required'],
  },
  approximateSize: {
    type: String,
    required: [true, 'Approximate size is required'],
    enum: ['Small (< 2 inches)', 'Medium (3-5 inches)', 'Large (6-9 inches)', 'Full Sleeve / Backpiece (10+ inches)', 'Custom Dimension']
  },
  preferredDate: {
    type: String, // YYYY-MM-DD
    required: [true, 'Preferred appointment date is required'],
    index: true,
  },
  preferredTimeSlot: {
    type: String, // e.g. "11:00", "14:00"
    required: [true, 'Preferred time slot is required'],
  },
  durationMinutes: {
    type: Number,
    default: 120,
  },
  budgetRange: {
    type: String,
    default: '$200 - $500',
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  referenceImages: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
    index: true,
  },
  internalNotes: {
    type: String,
    default: '',
  },
  rescheduleReason: {
    type: String,
    default: '',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String,
    updatedBy: String,
  }]
}, {
  timestamps: true,
});

// Auto generate human readable booking reference ID like INK-2026-XXXX
bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingRef = `INK-${new Date().getFullYear()}-${random}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
