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

    // 3. Tattoo Designs for 3D Placement Studio — Seed only if empty
    const designCount = await TattooDesign.countDocuments();
    if (designCount === 0) {
      await TattooDesign.create([
        {
          name: 'Mahadev Trishul & Sacred Om',
          slug: 'mahadev-trishul-sacred-om',
          style: 'Geometric',
          bodyAreas: ['Forearm', 'Upper Arm', 'Chest', 'Back', 'Calf'],
          description: 'Sacred Trishul emblem entwined with the primordial Om mantra and third-eye geometry. Symbolizes divine protection, cosmic consciousness, and inner power.',
          previewImage: '/images/tattoos/mahadev_trishul.jpg',
          transparentOverlay: '/images/tattoos/mahadev_trishul.jpg',
          difficulty: 'Complex',
          estTimeHours: 3.5,
          estPriceRange: '₹3,500 - ₹6,500',
          isFeatured: true,
          artist: 'Master Sunil (Una)',
          tags: ['Mahadev', 'Trishul', 'Sacred Geometry', 'Om', 'Spiritual']
        },
        {
          name: 'Himalayan Wild Peony & Moon',
          slug: 'himalayan-wild-peony',
          style: 'Minimalist',
          bodyAreas: ['Forearm', 'Wrist', 'Shoulder', 'Ribs', 'Ankle'],
          description: 'Ultra-delicate single-needle botanical peony with soft stippling gradients and micro-foliage. Represents rebirth, peace, and natural elegance.',
          previewImage: '/images/tattoos/moon_flora.jpg',
          transparentOverlay: '/images/tattoos/moon_flora.jpg',
          difficulty: 'Simple',
          estTimeHours: 2.5,
          estPriceRange: '₹2,500 - ₹4,500',
          isFeatured: true,
          artist: 'Aman Verma',
          tags: ['Botanical', 'Floral', 'Minimalist', 'Fine Line']
        },
        {
          name: 'Devbhoomi Sacred Mandala',
          slug: 'devbhoomi-sacred-mandala',
          style: 'Mandala',
          bodyAreas: ['Shoulder', 'Chest', 'Back', 'Thigh', 'Forearm'],
          description: 'Concentric 12-petaled lotus mandala based on the golden ratio and ancient yantras. Radiates harmonious spiritual balance.',
          previewImage: '/images/tattoos/sacred_mandala.jpg',
          transparentOverlay: '/images/tattoos/sacred_mandala.jpg',
          difficulty: 'Complex',
          estTimeHours: 4.5,
          estPriceRange: '₹4,500 - ₹8,000',
          isFeatured: true,
          artist: 'Master Sunil (Una)',
          tags: ['Mandala', 'Lotus', 'Dotwork', 'Sacred']
        },
        {
          name: 'Serpent & Peony Fine Line',
          slug: 'serpent-peony-fine-line',
          style: 'Fine Line',
          bodyAreas: ['Forearm', 'Upper Arm', 'Ribs', 'Calf', 'Thigh'],
          description: 'Fluid serpentine contours entwined around wild mountain flora. Symbol of transformation, rebirth, and inner wisdom.',
          previewImage: '/images/tattoos/serpent_peony.jpg',
          transparentOverlay: '/images/tattoos/serpent_peony.jpg',
          difficulty: 'Complex',
          estTimeHours: 4.0,
          estPriceRange: '₹4,000 - ₹7,500',
          isFeatured: true,
          artist: 'Aman Verma',
          tags: ['Serpent', 'Snake', 'Peony', 'Fine Line', 'Nature']
        },
        {
          name: 'Sacred Lotus & Unalome',
          slug: 'sacred-lotus-unalome',
          style: 'Spiritual',
          bodyAreas: ['Back', 'Forearm', 'Sternum', 'Spine', 'Nape'],
          description: 'Blooming spiritual lotus rising through sacred unalome pathways. Reflects awakening, pure clarity, and enlightenment.',
          previewImage: '/images/tattoos/sacred_lotus.jpg',
          transparentOverlay: '/images/tattoos/sacred_lotus.jpg',
          difficulty: 'Simple',
          estTimeHours: 2.5,
          estPriceRange: '₹2,500 - ₹4,500',
          isFeatured: true,
          artist: 'Master Sunil (Una)',
          tags: ['Lotus', 'Unalome', 'Spiritual', 'Sacred Geometry', 'Devbhoomi']
        },
        {
          name: 'Geometric Himalayan Lion',
          slug: 'geometric-himalayan-lion',
          style: 'Geometric',
          bodyAreas: ['Upper Arm', 'Thigh', 'Chest', 'Back'],
          description: 'Bold royal lion with crystalline geometric crown and dramatic blackwork depth. Symbol of fearless leadership and valor.',
          previewImage: '/images/tattoos/geometric_lion.jpg',
          transparentOverlay: '/images/tattoos/geometric_lion.jpg',
          difficulty: 'Complex',
          estTimeHours: 5.0,
          estPriceRange: '₹5,500 - ₹9,500',
          isFeatured: true,
          artist: 'Vikram Thakur',
          tags: ['Lion', 'Geometric', 'Blackwork', 'Himalayan']
        },
        {
          name: 'Botanical Sacred Rose',
          slug: 'botanical-sacred-rose',
          style: 'Botanical',
          bodyAreas: ['Forearm', 'Wrist', 'Shoulder', 'Ankle'],
          description: 'Classical botanical rose with delicate thorns and layered petals. Symbol of passionate devotion and eternal beauty.',
          previewImage: '/images/tattoos/sacred_rose.jpg',
          transparentOverlay: '/images/tattoos/sacred_rose.jpg',
          difficulty: 'Simple',
          estTimeHours: 2.5,
          estPriceRange: '₹2,500 - ₹4,500',
          isFeatured: true,
          artist: 'Eliza',
          tags: ['Rose', 'Botanical', 'Floral', 'Fine Line']
        },
        {
          name: 'Gothic Blackwork Skull',
          slug: 'gothic-blackwork-skull',
          style: 'Gothic',
          bodyAreas: ['Forearm', 'Upper Arm', 'Calf', 'Chest'],
          description: 'Detailed anatomical skull with dark baroque ornamentation and heavy blackwork shading. Evokes memento mori and resilience.',
          previewImage: '/images/tattoos/gothic_skull.jpg',
          transparentOverlay: '/images/tattoos/gothic_skull.jpg',
          difficulty: 'Masterpiece',
          estTimeHours: 5.5,
          estPriceRange: '₹6,000 - ₹11,000',
          isFeatured: true,
          artist: 'Vikram Thakur',
          tags: ['Skull', 'Gothic', 'Blackwork', 'Dark Art']
        },
        {
          name: 'Trishul Dagger & Sacred Heart',
          slug: 'trishul-dagger-sacred-heart',
          style: 'Neo-Traditional',
          bodyAreas: ['Forearm', 'Calf', 'Thigh', 'Sternum'],
          description: 'Ornamental sacred Trishul blade with radiant rays and mystical geometry. Blends traditional devotional motifs with sharp edge art.',
          previewImage: '/images/tattoos/trishul_dagger.jpg',
          transparentOverlay: '/images/tattoos/trishul_dagger.jpg',
          difficulty: 'Complex',
          estTimeHours: 4.5,
          estPriceRange: '₹4,500 - ₹8,500',
          isFeatured: true,
          artist: 'Master Sunil (Una)',
          tags: ['Trishul', 'Dagger', 'Neo-Traditional', 'Sacred']
        }
      ]);
      console.log('[Seeder] Seeded default 3D tattoo designs.');
    } else {
      const legacyDesigns = await TattooDesign.find({ previewImage: { $regex: 'unsplash.com' } });
      for (const item of legacyDesigns) {
        const titleLower = item.name.toLowerCase();
        let correctImage = '/images/tattoos/mahadev_trishul.jpg';
        if (titleLower.includes('trishul') || titleLower.includes('shiva')) correctImage = titleLower.includes('dagger') ? '/images/tattoos/trishul_dagger.jpg' : '/images/tattoos/mahadev_trishul.jpg';
        else if (titleLower.includes('moon') || titleLower.includes('peony')) correctImage = '/images/tattoos/moon_flora.jpg';
        else if (titleLower.includes('serpent') || titleLower.includes('snake')) correctImage = '/images/tattoos/serpent_peony.jpg';
        else if (titleLower.includes('lotus') || titleLower.includes('watercolor')) correctImage = '/images/tattoos/sacred_lotus.jpg';
        else if (titleLower.includes('lion')) correctImage = '/images/tattoos/geometric_lion.jpg';
        else if (titleLower.includes('mandala') || titleLower.includes('yantra')) correctImage = '/images/tattoos/sacred_mandala.jpg';
        else if (titleLower.includes('rose')) correctImage = '/images/tattoos/sacred_rose.jpg';
        else if (titleLower.includes('skull')) correctImage = '/images/tattoos/gothic_skull.jpg';
        else if (titleLower.includes('dagger')) correctImage = '/images/tattoos/trishul_dagger.jpg';

        await TattooDesign.updateOne({ _id: item._id }, { $set: { previewImage: correctImage, transparentOverlay: correctImage } });
      }
    }

    // 4. Portfolio Showcase — Seed & update authentic artworks
    const portfolioCount = await Portfolio.countDocuments();
    const defaultArtistId = artists[0]?._id;
    if (portfolioCount === 0) {
      await Portfolio.create([
        {
          title: 'Mahadev Trishul Sleeve',
          slug: 'mahadev-trishul-sleeve',
          description: 'Full arm sleeve composition incorporating Lord Shiva, Trishul, Damru, and sacred Himalayan geometry.',
          style: 'Geometric',
          category: 'Spiritual',
          bodyPlacement: 'Full Arm / Sleeve',
          coverImage: '/images/tattoos/mahadev_trishul.jpg',
          artist: defaultArtistId,
          sessionHours: 12,
          likes: 490,
          isFeatured: true,
          tags: ['Sleeve', 'Mahadev', 'Trishul', 'Sacred Geometry'],
        },
        {
          title: 'Trishul Dagger & Sacred Heart',
          slug: 'trishul-dagger-sacred-heart',
          description: 'Ornamental sacred Trishul blade with radiant rays and mystical geometry.',
          style: 'Neo-Traditional',
          category: 'Neo-Traditional',
          bodyPlacement: 'Forearm / Calf',
          coverImage: '/images/tattoos/trishul_dagger.jpg',
          artist: defaultArtistId,
          sessionHours: 4.5,
          likes: 580,
          isFeatured: true,
          tags: ['Trishul', 'Dagger', 'Neo-Traditional', 'Sacred'],
        },
        {
          title: 'Sacred Mandala & Dotwork Yantra',
          slug: 'sacred-mandala-yantra',
          description: 'Concentric 12-fold sacred geometry yantra with hypnotic stippled dotwork gradients.',
          style: 'Mandala',
          category: 'Geometric',
          bodyPlacement: 'Upper Back / Shoulder',
          coverImage: '/images/tattoos/sacred_mandala.jpg',
          artist: defaultArtistId,
          sessionHours: 5,
          likes: 420,
          isFeatured: true,
          tags: ['Mandala', 'Dotwork', 'Sacred Geometry'],
        },
        {
          title: 'Himalayan Wild Peony & Moon',
          slug: 'himalayan-wild-peony-moon',
          description: 'Delicate fine-line Himalayan botanical floral and crescent moon with micro-shadowing on collarbone.',
          style: 'Minimalist',
          category: 'Fine Line',
          bodyPlacement: 'Collarbone / Wrist',
          coverImage: '/images/tattoos/moon_flora.jpg',
          artist: artists[1]?._id || defaultArtistId,
          sessionHours: 2.5,
          likes: 640,
          isFeatured: true,
          tags: ['Fine Line', 'Botanical', 'Floral', 'Moon'],
        },
        {
          title: 'Geometric Himalayan Lion',
          slug: 'mountain-lion-blackwork',
          description: 'Deep saturated black ink composition with intense contrast and sharp needlework.',
          style: 'Geometric',
          category: 'Geometric',
          bodyPlacement: 'Chest & Sternum',
          coverImage: '/images/tattoos/geometric_lion.jpg',
          artist: artists[3]?._id || defaultArtistId,
          sessionHours: 4.5,
          likes: 380,
          isFeatured: true,
          tags: ['Geometric', 'Lion', 'Blackwork'],
        },
        {
          title: 'Sacred Lotus & Unalome',
          slug: 'sacred-lotus-unalome',
          description: 'Blooming spiritual lotus rising through sacred unalome pathways. Reflects awakening, pure clarity, and enlightenment.',
          style: 'Spiritual',
          category: 'Spiritual',
          bodyPlacement: 'Shoulder & Ribs',
          coverImage: '/images/tattoos/sacred_lotus.jpg',
          artist: artists[2]?._id || defaultArtistId,
          sessionHours: 3.5,
          likes: 510,
          isFeatured: true,
          tags: ['Lotus', 'Unalome', 'Spiritual'],
        },
        {
          title: 'Serpent & Peony Fine Line',
          slug: 'serpent-peony-fine-line',
          description: 'Fluid serpentine contours entwined around wild mountain flora.',
          style: 'Fine Line',
          category: 'Fine Line',
          bodyPlacement: 'Forearm / Ribs',
          coverImage: '/images/tattoos/serpent_peony.jpg',
          artist: artists[1]?._id || defaultArtistId,
          sessionHours: 4.0,
          likes: 475,
          isFeatured: true,
          tags: ['Serpent', 'Snake', 'Peony', 'Fine Line'],
        },
        {
          title: 'Botanical Sacred Rose',
          slug: 'botanical-sacred-rose',
          description: 'Classical botanical rose with delicate thorns and layered petals.',
          style: 'Botanical',
          category: 'Botanical',
          bodyPlacement: 'Forearm / Wrist',
          coverImage: '/images/tattoos/sacred_rose.jpg',
          artist: artists[2]?._id || defaultArtistId,
          sessionHours: 2.5,
          likes: 460,
          isFeatured: true,
          tags: ['Rose', 'Botanical', 'Floral'],
        },
        {
          title: 'Gothic Blackwork Skull',
          slug: 'gothic-blackwork-skull',
          description: 'Detailed anatomical skull with dark baroque ornamentation and heavy blackwork shading.',
          style: 'Blackwork',
          category: 'Blackwork',
          bodyPlacement: 'Upper Arm / Calf',
          coverImage: '/images/tattoos/gothic_skull.jpg',
          artist: artists[3]?._id || defaultArtistId,
          sessionHours: 5.0,
          likes: 410,
          isFeatured: true,
          tags: ['Skull', 'Gothic', 'Blackwork'],
        }
      ]);
      console.log('[Seeder] Seeded default portfolio pieces.');
    } else {
      // Auto-update any legacy unsplash URLs to authentic artwork
      const legacyPortfolios = await Portfolio.find({ coverImage: { $regex: 'unsplash.com' } });
      for (const item of legacyPortfolios) {
        const titleLower = item.title.toLowerCase();
        let correctImage = '/images/tattoos/mahadev_trishul.jpg';
        if (titleLower.includes('trishul') || titleLower.includes('shiva')) correctImage = titleLower.includes('dagger') ? '/images/tattoos/trishul_dagger.jpg' : '/images/tattoos/mahadev_trishul.jpg';
        else if (titleLower.includes('moon') || titleLower.includes('peony')) correctImage = '/images/tattoos/moon_flora.jpg';
        else if (titleLower.includes('serpent') || titleLower.includes('snake')) correctImage = '/images/tattoos/serpent_peony.jpg';
        else if (titleLower.includes('lotus') || titleLower.includes('watercolor')) correctImage = '/images/tattoos/sacred_lotus.jpg';
        else if (titleLower.includes('lion')) correctImage = '/images/tattoos/geometric_lion.jpg';
        else if (titleLower.includes('mandala') || titleLower.includes('yantra')) correctImage = '/images/tattoos/sacred_mandala.jpg';
        else if (titleLower.includes('rose')) correctImage = '/images/tattoos/sacred_rose.jpg';
        else if (titleLower.includes('skull')) correctImage = '/images/tattoos/gothic_skull.jpg';
        else if (titleLower.includes('dagger')) correctImage = '/images/tattoos/trishul_dagger.jpg';

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

    // 7. Blog Posts — Seed only if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create([
        {
          title: 'How to Prepare Your Body and Mind for a Multi-Hour Tattoo Session',
          slug: 'prep-your-body-for-tattoo-session',
          excerpt: 'Hydration, carb loading, skin prep, and breathing techniques to maximize endurance in the chair.',
          content: 'Preparation is the secret to a comfortable tattoo session. Learn how to hydrate, eat balanced meals, and mentally prepare for your bespoke artwork.',
          coverImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
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
          coverImage: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=800&q=80',
          author: 'Master Sunil — Lead Artist',
          category: 'Tattoo Styles',
          tags: ['Mahadev', 'Sacred Geometry', 'Devbhoomi', 'Symbolism'],
          readTimeMinutes: 4,
          isPublished: true,
        },
        {
          title: 'Preserving Contrast: The Science of Tattoo Longevity and Aftercare',
          slug: 'preserving-contrast-tattoo-longevity',
          excerpt: 'Understanding UV photodegradation, immune macrophage ink lock-in, and lifelong pigment brilliance.',
          content: 'Your tattoo is a living piece of art. Learn how medical-grade aftercare and UV protection keep black ink crisp and colors vibrant for a lifetime.',
          coverImage: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
          author: 'Aman Verma — Senior Resident',
          category: 'Tattoo Aftercare',
          tags: ['Aftercare', 'Science', 'Longevity', 'Sun Protection'],
          readTimeMinutes: 6,
          isPublished: true,
        }
      ]);
      console.log('[Seeder] Seeded default blog posts.');
    }

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
