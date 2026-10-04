import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide portfolio piece title'],
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: 'Custom',
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: false,
  },
  artistName: {
    type: String,
    default: 'Land of God Studio',
  },
  bodyPlacement: {
    type: String,
    default: 'General',
  },
  images: [{
    type: String,
    required: true,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
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

export default mongoose.model('Portfolio', portfolioSchema);
