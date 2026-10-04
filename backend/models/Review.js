import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
  },
  authorLocation: {
    type: String,
    default: 'Una, Himachal Pradesh',
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  reviewText: {
    type: String,
    required: true,
  },
  tattooStyle: {
    type: String,
    default: 'Custom Devbhoomi & Sacred Tattoo',
  },
  source: {
    type: String,
    default: 'Google Verified Review',
  },
  googleMapsLink: {
    type: String,
    default: 'https://share.google/8Ck6bnKVFP2JNuUQT',
  },
  isFeatured: {
    type: Boolean,
    default: true,
  },
  reviewDate: {
    type: String,
    default: 'Recently',
  }
}, {
  timestamps: true,
});

export default mongoose.model('Review', reviewSchema);
