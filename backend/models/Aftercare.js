import mongoose from 'mongoose';

const aftercareSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'ShieldCheck',
  },
  category: {
    type: String,
    enum: [
      'Immediate Care',
      'Cleaning Instructions',
      'Moisturizing',
      'Showering & Water',
      'Clothing & Protection',
      'Healing Stages',
      'Activities to Avoid',
      'Signs of Complications',
      'FAQ'
    ],
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  detailedSteps: [{
    type: String,
  }],
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

export default mongoose.model('Aftercare', aftercareSchema);
