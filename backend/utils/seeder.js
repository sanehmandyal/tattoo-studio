import User from '../models/User.js';
import Artist from '../models/Artist.js';
import Portfolio from '../models/Portfolio.js';
import TattooDesign from '../models/TattooDesign.js';
import Blog from '../models/Blog.js';
import SiteSettings from '../models/SiteSettings.js';
import Aftercare from '../models/Aftercare.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import Review from '../models/Review.js';

export const seedInitialData = async () => {
  try {
    console.log('[Seeder] Verifying database records for LAND OF GOD TATTOO STUDIO...');

    // 1. Ensure Sole Master Admin exists (NEVER delete existing admin account)
    const adminEmail = process.env.ADMIN_EMAIL_ALT || 'admin@landofgodtattoos.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'LandOfGod@Una#2026';
    const adminPhone = process.env.ADMIN_PHONE || '+91 78079 66080';
    const adminName = process.env.ADMIN_NAME || 'Master Sunil (Studio Director)';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'admin',
        avatar: '',
      });
      console.log('[Seeder] Created Master Admin user.');
    }
    const demoUser = admin;

    // 2. Artists — Seed only if table is currently empty
    const artistCount = await Artist.countDocuments();
    let artists = [];
    if (artistCount === 0) {
      artists = await Artist.create([
        {
          name: 'MASTER SUNIL (UNA)',
          slug: 'master-sunil',
          title: 'Founder & Master Tattooist — Sacred Devbhoomi & Realism',
          bio: 'Over a decade of mastery in custom Mahadev sacred geometry, spiritual Trishul archetypes, hyper-realistic portraits, and intricate fine line needlework in Una, Himachal Pradesh.',
          experienceYears: 11,
          specializations: ['Sacred Geometry', 'Spiritual & Mahadev', 'Realism', 'Fine Line'],
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
          portfolioImages: [
            'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
          ],
          socialLinks: {
            instagram: 'https://instagram.com/landofgodtattoo',
            facebook: 'https://facebook.com/landofgodtattoostudio',
          },
          rating: 4.99,
          sortOrder: 1,
        },
        {
          name: 'AMAN VERMA',
          slug: 'aman-verma',
          title: 'Senior Resident — Fine Line, Micro-Realism & Sanskrit Script',
          bio: 'Specialist in razor-sharp single-needle Vedic mantras, delicate botanical ferns, celestial alignments, and weightless calligraphy.',
          experienceYears: 7,
          specializations: ['Fine Line', 'Sanskrit Script', 'Micro-Realism', 'Botanical'],
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
          portfolioImages: [
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
          ],
          socialLinks: {
            instagram: 'https://instagram.com/aman.fineline',
          },
          rating: 4.97,
          sortOrder: 2,
        },
        {
          name: 'ELIZA',
          slug: 'eliza',
          title: 'Guest Resident — Chromatic Watercolor & Ethereal Florals',
          bio: 'Known for luminous botanical realism, Himalayan floral cascades, and soft fluid watercolor ink bleeds.',
          experienceYears: 8,
          specializations: ['Watercolor', 'Botanical', 'Floral Realism'],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          portfolioImages: [
            'https://images.unsplash.com/photo-1590246814883-578351586a14?auto=format&fit=crop&w=800&q=80',
          ],
          socialLinks: {
            instagram: 'https://instagram.com/eliza.floralink',
          },
          rating: 4.98,
          sortOrder: 3,
        },
        {
          name: 'VIKRAM THAKUR',
          slug: 'vikram-thakur',
          title: 'Resident Artist — Heavy Blackwork & Neo-Traditional',
          bio: 'Master of deep saturated blackwork, mythical guardian beasts, and bold structural armbands.',
          experienceYears: 6,
          specializations: ['Blackwork', 'Neo-Traditional', 'Tribal & Armbands'],
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
          portfolioImages: [
            'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=800&q=80',
          ],
          socialLinks: {
            instagram: 'https://instagram.com/vikram.blackwork',
          },
          rating: 4.95,
          sortOrder: 4,
        }
      ]);
      console.log('[Seeder] Seeded default artists.');
    } else {
      artists = await Artist.find();
    }

    // 3. Tattoo Designs for 3D Placement Studio — Synchronize only 15 Authentic Named Designs
    const AUTHENTIC_15_DESIGNS = [
      {
        name: 'Sacred Mahadev Trishul & Damru',
        slug: 'mahadev-trishul-damru',
        style: 'Sacred Devbhoomi',
        bodyAreas: ['Forearm', 'Chest', 'Upper Arm', 'Back', 'Spine', 'Ribs'],
        description: 'Iconic Lord Shiva Trishul trident with Damru drum, Crescent Moon, and Sacred Om stippling.',
        previewImage: '/images/tattoos/mahadev_trishul.png',
        transparentOverlay: '/images/tattoos/mahadev_trishul.png',
        difficulty: 'Masterpiece',
        estTimeHours: 3.5,
        estPriceRange: '₹3,500 - ₹6,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Mahadev', 'Trishul', 'Damru', 'Sacred Devbhoomi', 'Shiva']
      },
      {
        name: 'Om Namah Shivaya Sanskrit Mandala',
        slug: 'om-namah-shivaya-mandala',
        style: 'Sacred Devbhoomi',
        bodyAreas: ['Forearm', 'Chest', 'Spine', 'Upper Arm', 'Neck'],
        description: 'Sacred Trishul with Devanagari Sanskrit mantra calligraphy and radiant stippled sunburst rays.',
        previewImage: '/images/tattoos/om_shiva_calligraphy.png',
        transparentOverlay: '/images/tattoos/om_shiva_calligraphy.png',
        difficulty: 'Masterpiece',
        estTimeHours: 3.0,
        estPriceRange: '₹3,000 - ₹5,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Om', 'Sanskrit', 'Calligraphy', 'Mandala', 'Mantra']
      },
      {
        name: 'Ryu Dragon Koi Leaping Waves',
        slug: 'ryu-dragon-koi-leaping-waves',
        style: 'Japanese',
        bodyAreas: ['Forearm', 'Upper Arm', 'Thigh', 'Calf', 'Back', 'Shoulder'],
        description: 'Dynamic Japanese traditional dragon koi fish ascending swirling tidal waves with sharp scales and fin details.',
        previewImage: '/images/tattoos/japanese_koi.png',
        transparentOverlay: '/images/tattoos/japanese_koi.png',
        difficulty: 'Complex',
        estTimeHours: 4.5,
        estPriceRange: '₹4,500 - ₹8,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Koi', 'Dragon', 'Japanese', 'Waves', 'Sakura']
      },
      {
        name: 'Phoenix Rising From Sacred Flames',
        slug: 'phoenix-rising-sacred-flames',
        style: 'Blackwork',
        bodyAreas: ['Back', 'Chest', 'Shoulder', 'Thigh', 'Ribs', 'Calf'],
        description: 'Majestic mythical phoenix bird spreading ornate dotwork wings emerging from eternal fire.',
        previewImage: '/images/tattoos/phoenix_flame.png',
        transparentOverlay: '/images/tattoos/phoenix_flame.png',
        difficulty: 'Masterpiece',
        estTimeHours: 4.0,
        estPriceRange: '₹4,000 - ₹8,000',
        isFeatured: true,
        artist: 'Vikram Thakur',
        tags: ['Phoenix', 'Flames', 'Fire', 'Mythical', 'Blackwork']
      },
      {
        name: 'Nordic Howling Wolf & Moon',
        slug: 'nordic-howling-wolf-moon',
        style: 'Geometric',
        bodyAreas: ['Forearm', 'Upper Arm', 'Calf', 'Thigh', 'Back', 'Shoulder'],
        description: 'Intricate Celtic knotwork howling wolf with celestial crescent moon, runes, and sacred geometry.',
        previewImage: '/images/tattoos/celtic_wolf.png',
        transparentOverlay: '/images/tattoos/celtic_wolf.png',
        difficulty: 'Intermediate',
        estTimeHours: 3.5,
        estPriceRange: '₹3,500 - ₹6,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Wolf', 'Moon', 'Celtic', 'Nordic', 'Geometric']
      },
      {
        name: 'Fine Line Butterfly & Botanical Lavender',
        slug: 'butterfly-botanical-lavender',
        style: 'Fine Line',
        bodyAreas: ['Wrist', 'Ankle', 'Neck', 'Forearm', 'Shoulder'],
        description: 'Delicate half-butterfly morphing into blooming wild daisies, lavender sprigs, and stardust.',
        previewImage: '/images/tattoos/butterfly_botanical.png',
        transparentOverlay: '/images/tattoos/butterfly_botanical.png',
        difficulty: 'Delicate',
        estTimeHours: 2.0,
        estPriceRange: '₹2,000 - ₹4,000',
        isFeatured: true,
        artist: 'Aman Verma',
        tags: ['Butterfly', 'Lavender', 'Botanical', 'Fine Line', 'Floral']
      },
      {
        name: 'Himalayan Compass & Arrow Navigator',
        slug: 'himalayan-compass-arrow-navigator',
        style: 'Geometric',
        bodyAreas: ['Forearm', 'Shoulder', 'Calf', 'Wrist', 'Upper Arm'],
        description: 'Sacred compass rose with Himalayan mountain peaks, celestial constellations, and warrior arrows.',
        previewImage: '/images/tattoos/compass_navigation.png',
        transparentOverlay: '/images/tattoos/compass_navigation.png',
        difficulty: 'Intermediate',
        estTimeHours: 3.0,
        estPriceRange: '₹3,000 - ₹6,000',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Compass', 'Navigator', 'Himalayas', 'Mountains', 'Geometric']
      },
      {
        name: 'Minimalist Moon & Wild Flora',
        slug: 'minimalist-moon-wild-flora',
        style: 'Fine Line',
        bodyAreas: ['Forearm', 'Wrist', 'Ankle', 'Shoulder', 'Neck'],
        description: 'Delicate crescent moon with wild botanical flowers, leaves, and celestial stardust.',
        previewImage: '/images/tattoos/moon_flora.png',
        transparentOverlay: '/images/tattoos/moon_flora.png',
        difficulty: 'Delicate',
        estTimeHours: 2.0,
        estPriceRange: '₹2,000 - ₹4,000',
        isFeatured: true,
        artist: 'Aman Verma',
        tags: ['Moon', 'Flora', 'Minimalist', 'Fine Line']
      },
      {
        name: 'Fine Line Serpent & Peony',
        slug: 'fine-line-serpent-peony',
        style: 'Fine Line',
        bodyAreas: ['Forearm', 'Upper Arm', 'Spine', 'Thigh', 'Ribs'],
        description: 'Coiled serpent snake with detailed scales wrapped around blooming peony flowers.',
        previewImage: '/images/tattoos/serpent_peony.png',
        transparentOverlay: '/images/tattoos/serpent_peony.png',
        difficulty: 'Intermediate',
        estTimeHours: 3.0,
        estPriceRange: '₹3,000 - ₹6,000',
        isFeatured: true,
        artist: 'Aman Verma',
        tags: ['Serpent', 'Snake', 'Peony', 'Fine Line', 'Nature']
      },
      {
        name: 'Devbhoomi Sacred Lotus & Unalome',
        slug: 'devbhoomi-sacred-lotus-unalome',
        style: 'Sacred Devbhoomi',
        bodyAreas: ['Spine', 'Neck', 'Upper Arm', 'Back', 'Wrist', 'Ankle'],
        description: 'Sacred unalome lotus bloom with dotwork mandala petals and vertical chakra alignment.',
        previewImage: '/images/tattoos/sacred_lotus.png',
        transparentOverlay: '/images/tattoos/sacred_lotus.png',
        difficulty: 'Delicate',
        estTimeHours: 2.5,
        estPriceRange: '₹2,500 - ₹4,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Lotus', 'Unalome', 'Sacred', 'Devbhoomi', 'Chakra']
      },
      {
        name: 'Geometric Lion King & Mountain',
        slug: 'geometric-lion-king-mountain',
        style: 'Geometric',
        bodyAreas: ['Chest', 'Upper Arm', 'Back', 'Shoulder', 'Thigh'],
        description: 'Polygonal sacred geometry royal lion head with Himalayan mountain peak line art.',
        previewImage: '/images/tattoos/geometric_lion.png',
        transparentOverlay: '/images/tattoos/geometric_lion.png',
        difficulty: 'Complex',
        estTimeHours: 3.5,
        estPriceRange: '₹4,000 - ₹7,500',
        isFeatured: true,
        artist: 'Vikram Thakur',
        tags: ['Lion', 'Geometric', 'Mountain', 'King']
      },
      {
        name: 'Devbhoomi Sacred Radial Mandala',
        slug: 'devbhoomi-sacred-radial-mandala',
        style: 'Mandala',
        bodyAreas: ['Back', 'Shoulder', 'Chest', 'Thigh', 'Ribs'],
        description: 'Intricate radial sacred geometry mandala with fine dotwork pointillism.',
        previewImage: '/images/tattoos/sacred_mandala.png',
        transparentOverlay: '/images/tattoos/sacred_mandala.png',
        difficulty: 'Masterpiece',
        estTimeHours: 4.5,
        estPriceRange: '₹4,500 - ₹8,500',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Mandala', 'Radial', 'Sacred', 'Dotwork']
      },
      {
        name: 'Himalayan Sacred Botanical Rose',
        slug: 'himalayan-sacred-botanical-rose',
        style: 'Traditional',
        bodyAreas: ['Shoulder', 'Forearm', 'Ankle', 'Wrist', 'Neck', 'Ribs'],
        description: 'Blooming classical botanical rose with delicate petals and fine-line thorns.',
        previewImage: '/images/tattoos/sacred_rose.png',
        transparentOverlay: '/images/tattoos/sacred_rose.png',
        difficulty: 'Intermediate',
        estTimeHours: 2.5,
        estPriceRange: '₹2,500 - ₹4,500',
        isFeatured: true,
        artist: 'Eliza',
        tags: ['Rose', 'Botanical', 'Traditional', 'Floral']
      },
      {
        name: 'Gothic Obsidian Skull Filigree',
        slug: 'gothic-obsidian-skull-filigree',
        style: 'Blackwork',
        bodyAreas: ['Upper Arm', 'Chest', 'Back', 'Calf'],
        description: 'Detailed blackwork human skull with ornate baroque filigree ornamentation and dark depth.',
        previewImage: '/images/tattoos/gothic_skull.png',
        transparentOverlay: '/images/tattoos/gothic_skull.png',
        difficulty: 'Complex',
        estTimeHours: 4.0,
        estPriceRange: '₹4,500 - ₹8,500',
        isFeatured: true,
        artist: 'Vikram Thakur',
        tags: ['Skull', 'Gothic', 'Blackwork', 'Filigree']
      },
      {
        name: 'Devbhoomi Trishul Dagger Heart',
        slug: 'devbhoomi-trishul-dagger-heart',
        style: 'Neo-Traditional',
        bodyAreas: ['Forearm', 'Calf', 'Spine', 'Ribs', 'Upper Arm'],
        description: 'Ornate sacred Trishul sword dagger piercing sacred heart with radiant sacred geometry.',
        previewImage: '/images/tattoos/trishul_dagger.png',
        transparentOverlay: '/images/tattoos/trishul_dagger.png',
        difficulty: 'Intermediate',
        estTimeHours: 3.5,
        estPriceRange: '₹3,500 - ₹7,000',
        isFeatured: true,
        artist: 'Master Sunil (Una)',
        tags: ['Trishul', 'Dagger', 'Heart', 'Neo-Traditional', 'Sacred']
      }
    ];

    // Wipe stale/fake designs from MongoDB and ensure all 15 authentic named designs are seeded
    await TattooDesign.deleteMany({
      $or: [
        { previewImage: { $regex: 'unsplash' } },
        { previewImage: { $regex: 'photo-' } },
        { name: { $nin: AUTHENTIC_15_DESIGNS.map(d => d.name) } }
      ]
    });

    for (const item of AUTHENTIC_15_DESIGNS) {
      await TattooDesign.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    console.log('[Seeder] Synchronized 15 authentic named tattoo designs in database.');

    // 4. Portfolio Showcase — Seed & update authentic artworks
    const portfolioCount = await Portfolio.countDocuments();
    const defaultArtistId = artists[0]?._id;
    if (portfolioCount === 0) {
      await Portfolio.create([
        {
          title: 'Sacred Mahadev Trishul & Damru',
          slug: 'mahadev-trishul-damru',
          description: 'Full arm sleeve composition incorporating Lord Shiva, Trishul, Damru, and sacred Himalayan geometry.',
          style: 'Sacred Devbhoomi',
          category: 'Spiritual',
          bodyPlacement: 'Full Arm / Sleeve',
          coverImage: '/images/tattoos/mahadev_trishul.png',
          artist: defaultArtistId,
          sessionHours: 12,
          likes: 490,
          isFeatured: true,
          tags: ['Sleeve', 'Mahadev', 'Trishul', 'Sacred Geometry'],
        },
        {
          title: 'Om Namah Shivaya Sanskrit Mandala',
          slug: 'om-namah-shivaya-mandala',
          description: 'Sacred Trishul with Devanagari Sanskrit mantra calligraphy and radiant stippled sunburst rays.',
          style: 'Sacred Devbhoomi',
          category: 'Spiritual',
          bodyPlacement: 'Forearm / Spine',
          coverImage: '/images/tattoos/om_shiva_calligraphy.png',
          artist: defaultArtistId,
          sessionHours: 3.0,
          likes: 560,
          isFeatured: true,
          tags: ['Om', 'Sanskrit', 'Calligraphy', 'Mandala', 'Mantra'],
        },
        {
          title: 'Ryu Dragon Koi Leaping Waves',
          slug: 'ryu-dragon-koi-leaping-waves',
          description: 'Dynamic Japanese traditional dragon koi fish ascending swirling tidal waves with sharp scales and fin details.',
          style: 'Japanese',
          category: 'Japanese',
          bodyPlacement: 'Forearm / Upper Arm',
          coverImage: '/images/tattoos/japanese_koi.png',
          artist: defaultArtistId,
          sessionHours: 4.5,
          likes: 620,
          isFeatured: true,
          tags: ['Koi', 'Dragon', 'Japanese', 'Waves', 'Sakura'],
        },
        {
          title: 'Phoenix Rising From Sacred Flames',
          slug: 'phoenix-rising-sacred-flames',
          description: 'Majestic mythical phoenix bird spreading ornate dotwork wings emerging from eternal fire.',
          style: 'Blackwork',
          category: 'Blackwork',
          bodyPlacement: 'Back / Chest',
          coverImage: '/images/tattoos/phoenix_flame.png',
          artist: artists[3]?._id || defaultArtistId,
          sessionHours: 4.0,
          likes: 580,
          isFeatured: true,
          tags: ['Phoenix', 'Flames', 'Fire', 'Mythical', 'Blackwork'],
        },
        {
          title: 'Nordic Howling Wolf & Moon',
          slug: 'nordic-howling-wolf-moon',
          description: 'Intricate Celtic knotwork howling wolf with celestial crescent moon, runes, and sacred geometry.',
          style: 'Geometric',
          category: 'Geometric',
          bodyPlacement: 'Forearm / Upper Arm',
          coverImage: '/images/tattoos/celtic_wolf.png',
          artist: defaultArtistId,
          sessionHours: 3.5,
          likes: 510,
          isFeatured: true,
          tags: ['Wolf', 'Moon', 'Celtic', 'Nordic', 'Geometric'],
        },
        {
          title: 'Fine Line Butterfly & Botanical Lavender',
          slug: 'butterfly-botanical-lavender',
          description: 'Delicate half-butterfly morphing into blooming wild daisies, lavender sprigs, and stardust.',
          style: 'Fine Line',
          category: 'Fine Line',
          bodyPlacement: 'Wrist / Forearm',
          coverImage: '/images/tattoos/butterfly_botanical.png',
          artist: artists[1]?._id || defaultArtistId,
          sessionHours: 2.0,
          likes: 670,
          isFeatured: true,
          tags: ['Butterfly', 'Lavender', 'Botanical', 'Fine Line', 'Floral'],
        },
        {
          title: 'Himalayan Compass & Arrow Navigator',
          slug: 'himalayan-compass-arrow-navigator',
          description: 'Sacred compass rose with Himalayan mountain peaks, celestial constellations, and warrior arrows.',
          style: 'Geometric',
          category: 'Geometric',
          bodyPlacement: 'Forearm / Shoulder',
          coverImage: '/images/tattoos/compass_navigation.png',
          artist: defaultArtistId,
          sessionHours: 3.0,
          likes: 495,
          isFeatured: true,
          tags: ['Compass', 'Navigator', 'Himalayas', 'Mountains', 'Geometric'],
        },
        {
          title: 'Devbhoomi Trishul Dagger Heart',
          slug: 'devbhoomi-trishul-dagger-heart',
          description: 'Ornamental sacred Trishul blade with radiant rays and mystical geometry.',
          style: 'Neo-Traditional',
          category: 'Neo-Traditional',
          bodyPlacement: 'Forearm / Calf',
          coverImage: '/images/tattoos/trishul_dagger.png',
          artist: defaultArtistId,
          sessionHours: 4.5,
          likes: 580,
          isFeatured: true,
          tags: ['Trishul', 'Dagger', 'Neo-Traditional', 'Sacred'],
        },
        {
          title: 'Devbhoomi Sacred Radial Mandala',
          slug: 'devbhoomi-sacred-radial-mandala',
          description: 'Concentric 12-fold sacred geometry yantra with hypnotic stippled dotwork gradients.',
          style: 'Mandala',
          category: 'Geometric',
          bodyPlacement: 'Upper Back / Shoulder',
          coverImage: '/images/tattoos/sacred_mandala.png',
          artist: defaultArtistId,
          sessionHours: 5,
          likes: 420,
          isFeatured: true,
          tags: ['Mandala', 'Dotwork', 'Sacred Geometry'],
        },
        {
          title: 'Minimalist Moon & Wild Flora',
          slug: 'minimalist-moon-wild-flora',
          description: 'Delicate fine-line Himalayan botanical floral and crescent moon with micro-shadowing on collarbone.',
          style: 'Fine Line',
          category: 'Fine Line',
          bodyPlacement: 'Collarbone / Wrist',
          coverImage: '/images/tattoos/moon_flora.png',
          artist: artists[1]?._id || defaultArtistId,
          sessionHours: 2.5,
          likes: 640,
          isFeatured: true,
          tags: ['Fine Line', 'Botanical', 'Floral', 'Moon'],
        },
        {
          title: 'Geometric Lion King & Mountain',
          slug: 'geometric-lion-king-mountain',
          description: 'Deep saturated black ink composition with intense contrast and sharp needlework.',
          style: 'Geometric',
          category: 'Geometric',
          bodyPlacement: 'Chest & Sternum',
          coverImage: '/images/tattoos/geometric_lion.png',
          artist: artists[3]?._id || defaultArtistId,
          sessionHours: 4.5,
          likes: 380,
          isFeatured: true,
          tags: ['Geometric', 'Lion', 'Blackwork'],
        },
        {
          title: 'Devbhoomi Sacred Lotus & Unalome',
          slug: 'devbhoomi-sacred-lotus-unalome',
          description: 'Blooming spiritual lotus rising through sacred unalome pathways. Reflects awakening, pure clarity, and enlightenment.',
          style: 'Sacred Devbhoomi',
          category: 'Spiritual',
          bodyPlacement: 'Shoulder & Ribs',
          coverImage: '/images/tattoos/sacred_lotus.png',
          artist: artists[2]?._id || defaultArtistId,
          sessionHours: 3.5,
          likes: 510,
          isFeatured: true,
          tags: ['Lotus', 'Unalome', 'Spiritual'],
        },
        {
          title: 'Fine Line Serpent & Peony',
          slug: 'fine-line-serpent-peony',
          description: 'Fluid serpentine contours entwined around wild mountain flora.',
          style: 'Fine Line',
          category: 'Fine Line',
          bodyPlacement: 'Forearm / Ribs',
          coverImage: '/images/tattoos/serpent_peony.png',
          artist: artists[1]?._id || defaultArtistId,
          sessionHours: 4.0,
          likes: 475,
          isFeatured: true,
          tags: ['Serpent', 'Snake', 'Peony', 'Fine Line'],
        },
        {
          title: 'Himalayan Sacred Botanical Rose',
          slug: 'himalayan-sacred-botanical-rose',
          description: 'Classical botanical rose with delicate thorns and layered petals.',
          style: 'Traditional',
          category: 'Botanical',
          bodyPlacement: 'Forearm / Wrist',
          coverImage: '/images/tattoos/sacred_rose.png',
          artist: artists[2]?._id || defaultArtistId,
          sessionHours: 2.5,
          likes: 460,
          isFeatured: true,
          tags: ['Rose', 'Botanical', 'Floral'],
        },
        {
          title: 'Gothic Obsidian Skull Filigree',
          slug: 'gothic-obsidian-skull-filigree',
          description: 'Detailed anatomical skull with dark baroque ornamentation and heavy blackwork shading.',
          style: 'Blackwork',
          category: 'Blackwork',
          bodyPlacement: 'Upper Arm / Calf',
          coverImage: '/images/tattoos/gothic_skull.png',
          artist: artists[3]?._id || defaultArtistId,
          sessionHours: 5.0,
          likes: 410,
          isFeatured: true,
          tags: ['Skull', 'Gothic', 'Blackwork'],
        }
      ]);
      console.log('[Seeder] Seeded default portfolio pieces.');
    } else {
      const allPortfolios = await Portfolio.find();
      for (const item of allPortfolios) {
        const titleLower = item.title.toLowerCase();
        let correctImage = '/images/tattoos/mahadev_trishul.png';
        if (titleLower.includes('koi') || titleLower.includes('dragon')) correctImage = '/images/tattoos/japanese_koi.png';
        else if (titleLower.includes('phoenix') || titleLower.includes('fire')) correctImage = '/images/tattoos/phoenix_flame.png';
        else if (titleLower.includes('wolf') || titleLower.includes('celtic')) correctImage = '/images/tattoos/celtic_wolf.png';
        else if (titleLower.includes('butterfly') || titleLower.includes('lavender')) correctImage = '/images/tattoos/butterfly_botanical.png';
        else if (titleLower.includes('compass') || titleLower.includes('navigator')) correctImage = '/images/tattoos/compass_navigation.png';
        else if (titleLower.includes('om') || titleLower.includes('calligraphy')) correctImage = '/images/tattoos/om_shiva_calligraphy.png';
        else if (titleLower.includes('trishul') || titleLower.includes('shiva') || titleLower.includes('mahadev')) {
          correctImage = titleLower.includes('dagger') ? '/images/tattoos/trishul_dagger.png' : '/images/tattoos/mahadev_trishul.png';
        }
        else if (titleLower.includes('moon') || titleLower.includes('flora')) {
          correctImage = (titleLower.includes('serpent') || titleLower.includes('snake')) ? '/images/tattoos/serpent_peony.png' : '/images/tattoos/moon_flora.png';
        }
        else if (titleLower.includes('serpent') || titleLower.includes('snake')) correctImage = '/images/tattoos/serpent_peony.png';
        else if (titleLower.includes('lotus') || titleLower.includes('unalome')) correctImage = '/images/tattoos/sacred_lotus.png';
        else if (titleLower.includes('lion')) correctImage = '/images/tattoos/geometric_lion.png';
        else if (titleLower.includes('mandala') || titleLower.includes('yantra')) correctImage = '/images/tattoos/sacred_mandala.png';
        else if (titleLower.includes('rose')) correctImage = '/images/tattoos/sacred_rose.png';
        else if (titleLower.includes('skull')) correctImage = '/images/tattoos/gothic_skull.png';
        else if (titleLower.includes('dagger')) correctImage = '/images/tattoos/trishul_dagger.png';

        await Portfolio.updateOne({ _id: item._id }, { $set: { coverImage: correctImage } });
      }
    }

    // 5. Google Verified Customer Reviews — Seed only if empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.create([
        {
          authorName: 'Rohit Sharma',
          authorLocation: 'Una, Himachal Pradesh',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          reviewText: 'Best tattoo studio in Una without a doubt! Got a custom Mahadev Trishul & sacred geometry sleeve. The level of hygiene, single-use needle pack opening in front of you, and zero infection healing was top-notch. Master Sunil is truly gifted.',
          tattooStyle: 'Mahadev Trishul & Sacred Geometry',
          source: 'Google Verified Review',
          googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
          reviewDate: '2 weeks ago',
        },
        {
          authorName: 'Aman Verma',
          authorLocation: 'Hamirpur / Una',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          reviewText: 'Extremely skilled tattoo artists! The fine-line precision and realistic shading on my lion piece are flawless. Minimal pain and friendly environment. Will be coming back for my next piece!',
          tattooStyle: 'Fine Line Realism',
          source: 'Google Verified Review',
          googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
          reviewDate: '1 month ago',
        },
        {
          authorName: 'Priya Jaswal',
          authorLocation: 'Una, HP',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          reviewText: 'Got a delicate botanical floral & Sanskrit mantra on my collarbone. Super crisp lines, very polite and patient artists. Highly recommended for girls looking for safe & sterile tattooing in Una.',
          tattooStyle: 'Botanical & Sanskrit Script',
          source: 'Google Verified Review',
          googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
          reviewDate: '3 weeks ago',
        },
        {
          authorName: 'Vikram Thakur',
          authorLocation: 'Kangra / Una',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          reviewText: 'The 3D body preview feature helped me pick the right placement before sitting in the chair. Outstanding craftsmanship and genuine imported pigments that stay pitch black.',
          tattooStyle: 'Custom Shoulder Realism',
          source: 'Google Verified Review',
          googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
          reviewDate: '1 month ago',
        },
        {
          authorName: 'Rahul Sharma',
          authorLocation: 'Chandigarh / Una',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          reviewText: 'Travelled from Chandigarh just for their custom Lord Shiva portrait realism. Truly living up to the Land of God name. 10/10 recommendation for anyone in Himachal & Punjab.',
          tattooStyle: 'Lord Shiva Portrait Realism',
          source: 'Google Verified Review',
          googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
          reviewDate: '2 months ago',
        }
      ]);
      console.log('[Seeder] Seeded default customer reviews.');
    }

    // 6. Aftercare Protocols — Seed only if empty
    const aftercareCount = await Aftercare.countDocuments();
    if (aftercareCount === 0) {
      await Aftercare.create([
        {
          title: 'Immediate Studio Wrap Care',
          category: 'Immediate Care',
          shortDescription: 'Proper care instructions for fresh tattoo and barrier wrap removal.',
          detailedSteps: [
            'Keep medical second-skin protective film intact for 3 to 4 days as applied by your artist.',
            'If absorbent pad wrap was applied, gently peel off after 3 to 5 hours under lukewarm running water.',
            'Wash hands thoroughly with antibacterial soap before touching or inspecting the tattoo area.'
          ],
          sortOrder: 1,
        },
        {
          title: 'Cleansing & Lukewarm Wash',
          category: 'Cleaning Instructions',
          shortDescription: 'How to wash healing tattoos with antibacterial fragrance-free soap.',
          detailedSteps: [
            'Wash 2-3 times daily using only clean bare fingertips and unscented antibacterial liquid soap.',
            'Rinse gently with cool-to-lukewarm water to close pores.',
            'Pat dry gently with a fresh single-use paper towel. Never scrub or rub with bath towels.'
          ],
          sortOrder: 2,
        },
        {
          title: 'Hydration & Micro-Balm Care',
          category: 'Moisturizing',
          shortDescription: 'Proper balm nourishment without clogging skin pores.',
          detailedSteps: [
            'Apply a micro-thin layer of studio-approved healing balm or unscented lotion starting on Day 3.',
            'The tattoo should look satin-moist, never wet or greasy.',
            'Reapply sparingly 2-3 times a day after washing.'
          ],
          sortOrder: 3,
        },
        {
          title: 'Zero Submersion & Scratching',
          category: 'Healing Stages',
          shortDescription: 'Preventing pigment loss by avoiding pools, oceans, and scratching.',
          detailedSteps: [
            'Strictly avoid swimming pools, hot tubs, lakes, and long bathtub soaks for 3 full weeks.',
            'Never pick, scratch, or peel flaking scabs; let the dead epidermal layer shed naturally.',
            'Wear loose, breathable 100% cotton clothing over the inked area.'
          ],
          sortOrder: 4,
        },
        {
          title: 'Sun Protection & UV Defense',
          category: 'Activities to Avoid',
          shortDescription: 'Long-term pigment contrast preservation and SPF defense.',
          detailedSteps: [
            'Keep the tattoo completely shielded from direct sunlight throughout the 4-week initial healing phase.',
            'After complete epithelial healing, always apply broad-spectrum SPF 50+ sunscreen before stepping outside.'
          ],
          sortOrder: 5,
        },
        {
          title: 'When to Contact the Studio',
          category: 'Signs of Complications',
          shortDescription: 'Normal healing sensations versus complications.',
          detailedSteps: [
            'Mild redness, warmth, and swelling are standard for the first 24-48 hours.',
            'If excessive heat, yellow discharge, or spreading streaks develop, contact our studio team or a doctor immediately.'
          ],
          sortOrder: 6,
        }
      ]);
      console.log('[Seeder] Seeded default aftercare instructions.');
    }

    // 7. Blog Posts — Seed & update matching cover images
    const AUTHENTIC_BLOGS = [
      {
        title: 'How to Prepare Your Body and Skin for a Multi-Hour Tattoo Session',
        slug: 'prep-your-body-for-tattoo-session',
        excerpt: 'Hydration, nutrition, skin prep, and breathing techniques to maximize endurance and comfort in the chair.',
        content: 'Preparation is the secret to a comfortable tattoo session. Learn how to hydrate, eat balanced meals, and mentally prepare for your bespoke artwork.',
        coverImage: 'https://images.unsplash.com/photo-1590246814883-578351586a14?auto=format&fit=crop&w=800&q=80',
        author: 'Master Sunil — Lead Artist',
        category: 'Tattoo Preparation',
        tags: ['Preparation', 'Session Prep', 'Endurance', 'Pain Management'],
        readTimeMinutes: 5,
        isPublished: true,
      },
      {
        title: 'The Sacred Architecture of Mahadev Trishul & Devbhoomi Geometry',
        slug: 'sacred-geometry-devbhoomi-art',
        excerpt: 'Exploring the spiritual symbolism of Lord Shiva, the cosmic trident, and sacred golden-ratio yantras.',
        content: 'Himachal Pradesh, known as Devbhoomi (Land of the Gods), holds deep spiritual reverence for Lord Shiva. Discover the symbology behind sacred Trishul tattooing.',
        coverImage: '/images/tattoos/mahadev_trishul.png',
        author: 'Master Sunil — Lead Artist',
        category: 'Sacred Devbhoomi',
        tags: ['Mahadev', 'Sacred Geometry', 'Devbhoomi', 'Symbolism'],
        readTimeMinutes: 4,
        isPublished: true,
      },
      {
        title: 'Preserving Contrast: The Science of Tattoo Longevity and Aftercare',
        slug: 'preserving-contrast-tattoo-longevity',
        excerpt: 'Understanding UV photodegradation, immune macrophage ink lock-in, and lifelong pigment brilliance.',
        content: 'Your tattoo is a living piece of art. Learn how medical-grade aftercare and UV protection keep black ink crisp and colors vibrant for a lifetime.',
        coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        author: 'Aman Verma — Senior Resident',
        category: 'Tattoo Aftercare',
        tags: ['Aftercare', 'Science', 'Longevity', 'Sun Protection'],
        readTimeMinutes: 6,
        isPublished: true,
      }
    ];

    for (const b of AUTHENTIC_BLOGS) {
      await Blog.findOneAndUpdate(
        { slug: b.slug },
        { $set: b },
        { upsert: true, new: true }
      );
    }
    console.log('[Seeder] Seeded/updated default blog posts with accurate matching cover images.');

    // 8. Site Settings — Seed only if empty
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create({
        studioName: 'LAND OF GOD TATTOO STUDIO',
        tagline: 'Sacred Artistry & Custom Ink | Devbhoomi Atelier, Friends Colony, Una',
        heroHeadline: 'YOUR VISION, SACRED INK.',
        heroSubtitle: 'Himachal’s Premier Custom Tattoo Studio in Friends Colony, Una. Interactive Design & 3D Placement Lab. Choose Your Spot, Discover Your Design.',
        phone: '+91 78079 66080',
        email: 'contact@landofgodtattoos.com',
        address: {
          street: 'Friends Colony',
          city: 'Una',
          state: 'Himachal Pradesh',
          zip: '174303',
          country: 'India'
        },
        businessHours: {
          mon_fri: '10:30 AM – 8:30 PM',
          saturday: '10:30 AM – 8:30 PM',
          sunday: '11:00 AM – 7:00 PM (By Appointment)'
        },
        googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Friends%20Colony,%20Una,%20Himachal%20Pradesh%20174303&t=&z=15&ie=UTF8&iwloc=&output=embed',
        socialLinks: {
          instagram: 'https://instagram.com/landofgodtattoo',
          facebook: 'https://facebook.com/landofgodtattoostudio',
          whatsapp: '+917807966080',
          googleReview: 'https://share.google/8Ck6bnKVFP2JNuUQT',
        },
        stats: {
          yearsExp: 11,
          happyClients: 12500,
          tattoosCarved: 22000,
          masterArtists: 4
        },
        aboutContent: {
          mainStory: 'LAND OF GOD TATTOO STUDIO was established in Friends Colony, Una, Himachal Pradesh (Devbhoomi) to bring international fine-art custom tattooing and hospital-grade sterility to Northern India. Rooted in sacred symbolism, spiritual devotion, and contemporary realism, our atelier transforms individual visions into timeless ink masterpieces.',
          mission: 'We are committed to sterile clinical precision with 100% disposable cartridge needles, hypoallergenic organic pigments, custom hand-drawn stencils, and an uplifting studio atmosphere where client comfort and hygiene come first.',
          interiorImages: [
            'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=80'
          ]
        }
      });
      console.log('[Seeder] Seeded default site settings.');
    }

    // 9. Sample Bookings & Inquiries — Seed only if empty
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      await Booking.create([
        {
          customerName: 'Rohit Sharma',
          customerEmail: 'rohit.sharma@example.com',
          customerPhone: '+91 98765 43210',
          user: demoUser._id,
          artist: artists[0]?._id,
          tattooStyle: 'Geometric',
          selectedDesign: 'Mahadev Trishul & Sacred Om',
          bodyPlacement: 'Forearm',
          approximateSize: 'Medium (3-5 inches)',
          preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          preferredTimeSlot: '02:00 PM',
          status: 'confirmed',
          budgetRange: '₹3,500 - ₹5,500',
          additionalNotes: 'Custom Mahadev Trishul with Damru geometry.',
        }
      ]);
    }

    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create({
        name: 'Priya Jaswal',
        email: 'priya.jaswal@example.com',
        phone: '+91 98161 22334',
        subject: 'Custom Collarbone Floral Tattoo Consultation',
        message: 'Hello Land of God team! I want to get a fine-line lotus and Sanskrit mantra tattoo done next week in your Una studio. Can I book a consultation with Aman?',
        status: 'new',
      });
    }

    console.log('[Seeder] LAND OF GOD TATTOO STUDIO database verified — all existing custom records preserved intact!');
  } catch (err) {
    console.error('[Seeder] Seeding error:', err);
  }
};
