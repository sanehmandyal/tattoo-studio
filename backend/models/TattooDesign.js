import mongoose from 'mongoose';

const tattooDesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide design name'],
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  style: {
    type: String,
    required: true,
    enum: [
      'Geometric',
      'Traditional',
      'Neo-Traditional',
      'Realism',
      'Fine Line',
      'Minimalist',
      'Script',
      'Mandala',
      'Tribal',
      'Japanese',
      'Blackwork',
      'Watercolor',
      'Sleeve'
    ],
  },
  bodyAreas: [{
    type: String,
    required: true,
    enum: [
      'Forearm',
      'Upper Arm',
      'Shoulder',
      'Chest',
      'Back',
      'Neck',
      'Wrist',
      'Calf',
      'Thigh',
      'Ankle',
      'Ribs',
      'Hand',
      'Collarbone',
      'Spine',
      'Sleeve'
    ]
  }],
  description: {
    type: String,
    required: true,
  },
  previewImage: {
    type: String,
    required: true,
  },
  transparentOverlay: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Simple', 'Intermediate', 'Complex', 'Masterpiece'],
    default: 'Intermediate'
  },
  estTimeHours: {
    type: Number,
    default: 3,
  },
  estPriceRange: {
    type: String,
    default: '$250 - $450',
  },
  isFeatured: {
    type: Boolean,
    default: false,
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

export default mongoose.model('TattooDesign', tattooDesignSchema);
