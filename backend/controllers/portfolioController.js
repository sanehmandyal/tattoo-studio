import Portfolio from '../models/Portfolio.js';

export const getPortfolio = async (req, res, next) => {
  try {
    const { style, artist, placement, search, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };

    if (style && style !== 'All') {
      query.style = style;
    }
    if (artist && artist !== 'All') {
      query.artist = artist;
    }
    if (placement && placement !== 'All') {
      query.bodyPlacement = placement;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Portfolio.countDocuments(query);
    const portfolio = await Portfolio.find(query)
      .populate('artist', 'name title avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: portfolio.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id).populate('artist');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio piece not found' });
    }

    // Increment views
    item.views = (item.views || 0) + 1;
    await item.save();

    // Related portfolio pieces
    const related = await Portfolio.find({
      _id: { $ne: item._id },
      $or: [{ style: item.style }, { artist: item.artist._id }],
      isActive: true,
    }).limit(3).populate('artist', 'name avatar');

    res.json({ success: true, portfolioItem: item, related });
  } catch (error) {
    next(error);
  }
};

export const createPortfolio = async (req, res, next) => {
  try {
    const { title, description, style, artist, artistName, bodyPlacement, images, coverImage, tags, isFeatured } = req.body;

    const slug = (title || 'tattoo-piece').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const imageList = Array.isArray(images) && images.length > 0 
      ? images 
      : (coverImage ? [coverImage] : []);
    
    const portfolioData = {
      title,
      slug: `${slug}-${Date.now()}`,
      description: description || '',
      style: style || 'Custom',
      artistName: artistName || 'Land of God Studio',
      bodyPlacement: bodyPlacement || 'General',
      images: imageList.length > 0 ? imageList : ['/uploads/sample.jpg'],
      coverImage: coverImage || imageList[0] || '/uploads/sample.jpg',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      isFeatured: Boolean(isFeatured),
    };

    if (artist && artist.trim() && artist.length === 24) {
      portfolioData.artist = artist;
    }

    const portfolio = await Portfolio.create(portfolioData);

    res.status(201).json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    let item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    if (req.body.artist !== undefined && (!req.body.artist || req.body.artist.trim().length !== 24)) {
      delete req.body.artist;
    }

    item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, portfolioItem: item });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Portfolio piece deleted' });
  } catch (error) {
    next(error);
  }
};
