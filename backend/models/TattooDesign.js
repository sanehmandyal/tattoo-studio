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
  },
  bodyAreas: [{
    type: String,
    required: true,
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
    default: 'Intermediate'
  },
  estTimeHours: {
    type: Number,
    default: 3,
  },
  estPriceRange: {
    type: String,
    default: '₹3,500 - ₹6,500',
  },
  isDefaultReference: {
    type: Boolean,
    default: false,
  },
  isReferenceTattoo: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
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
