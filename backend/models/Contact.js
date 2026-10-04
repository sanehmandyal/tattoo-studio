import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    default: 'General Studio Inquiry',
  },
  message: {
    type: String,
    required: [true, 'Please write your message'],
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new',
  },
  internalNotes: {
    type: String,
    default: '',
  },
  respondedAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Contact', contactSchema);
