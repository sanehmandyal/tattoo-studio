import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  coverImage: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'INK CARVERS Master Team',
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Tattoo Inspiration',
      'Tattoo Styles',
      'Tattoo Preparation',
      'Tattoo Aftercare',
      'Artist Stories',
      'Studio News',
      'Tattoo Trends'
    ],
    default: 'Tattoo Inspiration'
  },
  tags: [{
    type: String,
  }],
  readTimeMinutes: {
    type: Number,
    default: 4,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

export default mongoose.model('Blog', blogSchema);
