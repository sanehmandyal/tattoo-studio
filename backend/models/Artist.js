import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the artist name'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  title: {
    type: String,
    default: 'Resident Master Tattooist',
  },
  bio: {
    type: String,
    required: [true, 'Please provide artist biography'],
  },
  experienceYears: {
    type: Number,
    default: 5,
  },
  specializations: [{
    type: String,
    trim: true,
  }],
  avatar: {
    type: String,
    required: true,
  },
  portfolioImages: [{
    type: String,
  }],
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
  rating: {
    type: Number,
    default: 4.9,
    min: 1,
    max: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  workingHours: {
    start: { type: String, default: '10:00' },
    end: { type: String, default: '20:00' },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6], // Mon-Sat
    },
    slotDurationMinutes: {
      type: Number,
      default: 60,
    }
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Artist', artistSchema);
