import Artist from '../models/Artist.js';

export const getArtists = async (req, res, next) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isActive: true };
    const artists = await Artist.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: artists.length, artists });
  } catch (error) {
    next(error);
  }
};

export const getArtistBySlug = async (req, res, next) => {
  try {
    const artist = await Artist.findOne({
      $or: [{ slug: req.params.slugOrId }, { _id: req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/) ? req.params.slugOrId : null }]
    });

    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    res.json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const { name, title, bio, experienceYears, specializations, avatar, portfolioImages, socialLinks, workingHours } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const artist = await Artist.create({
      name,
      slug,
      title,
      bio,
      experienceYears: experienceYears || 5,
      specializations: Array.isArray(specializations) ? specializations : (specializations ? specializations.split(',').map(s => s.trim()) : []),
      avatar,
      portfolioImages: portfolioImages || [],
      socialLinks: socialLinks || {},
      workingHours: workingHours || { start: '10:00', end: '20:00', workingDays: [1,2,3,4,5,6] },
    });

    res.status(201).json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (req, res, next) => {
  try {
    let artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    if (req.body.name && req.body.name !== artist.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    if (typeof req.body.specializations === 'string') {
      req.body.specializations = req.body.specializations.split(',').map(s => s.trim());
    }

    artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    await artist.deleteOne();
    res.json({ success: true, message: 'Artist removed successfully' });
  } catch (error) {
    next(error);
  }
};
