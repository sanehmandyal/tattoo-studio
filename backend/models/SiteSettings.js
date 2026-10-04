import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  studioName: {
    type: String,
    default: 'INK CARVERS',
  },
  tagline: {
    type: String,
    default: 'Interactive Design & Expert Artistry',
  },
  heroHeadline: {
    type: String,
    default: 'YOUR VISION, OUR INK.',
  },
  heroSubtitle: {
    type: String,
    default: 'Interactive Design & Expert Artistry. Choose Your Spot, Discover Your Design.',
  },
  phone: {
    type: String,
    default: '+1 (555) 392-8288',
  },
  email: {
    type: String,
    default: 'appointments@inkcarvers.com',
  },
  address: {
    street: { type: String, default: '123 Artisan Ave, Suite 400' },
    city: { type: String, default: 'Arts District' },
    state: { type: String, default: 'CA' },
    zip: { type: String, default: '90013' },
    country: { type: String, default: 'USA' }
  },
  businessHours: {
    mon_fri: { type: String, default: '11:00 AM – 9:00 PM' },
    saturday: { type: String, default: '10:00 AM – 10:00 PM' },
    sunday: { type: String, default: '12:00 PM – 7:00 PM' }
  },
  googleMapsEmbedUrl: {
    type: String,
    default: 'https://maps.google.com/maps?q=Downtown+Los+Angeles+Arts+District&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/inkcarvers' },
    facebook: { type: String, default: 'https://facebook.com/inkcarvers' },
    tiktok: { type: String, default: 'https://tiktok.com/@inkcarvers' },
    whatsapp: { type: String, default: '+15553928288' }
  },
  stats: {
    yearsExp: { type: Number, default: 12 },
    happyClients: { type: Number, default: 15400 },
    tattoosCarved: { type: Number, default: 28000 },
    masterArtists: { type: Number, default: 8 }
  },
  bookingSettings: {
    slotDurationMinutes: { type: Number, default: 60 },
    leadTimeDays: { type: Number, default: 1 },
    maxAdvanceDays: { type: Number, default: 90 },
    depositRequired: { type: Boolean, default: true },
    depositAmount: { type: Number, default: 100 }
  },
  aboutContent: {
    mainStory: {
      type: String,
      default: 'INK CARVERS Tattoo Studio was founded on the philosophy that modern ink should be an uncompromised intersection of bespoke fine-art and medical-grade safety standards. We bring together award-winning master craftsmen specializing in hyper-realism, intricate fine-line, geometry, and timeless blackwork.'
    },
    mission: {
      type: String,
      default: 'Our mission is to translate personal narratives, visionary aesthetics, and timeless archetypes onto human canvas with meticulous precision, zero cross-contamination risk, and lifelong pigment vibrancy.'
    },
    interiorImages: [{
      type: String,
    }]
  }
}, {
  timestamps: true,
});

export default mongoose.model('SiteSettings', siteSettingsSchema);
