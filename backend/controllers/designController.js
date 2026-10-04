import TattooDesign from '../models/TattooDesign.js';

export const getDesigns = async (req, res, next) => {
  try {
    const { bodyArea, style, featured } = req.query;
    const query = { isActive: true };

    if (bodyArea && bodyArea !== 'All') {
      query.bodyAreas = { $in: [bodyArea] };
    }
    if (style && style !== 'All') {
      query.style = style;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const designs = await TattooDesign.find(query).sort({ isFeatured: -1, likes: -1, createdAt: -1 });
    res.json({ success: true, count: designs.length, designs });
  } catch (error) {
    next(error);
  }
};

export const getDesignById = async (req, res, next) => {
  try {
    const design = await TattooDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }
    res.json({ success: true, design });
  } catch (error) {
    next(error);
  }
};

export const createDesign = async (req, res, next) => {
  try {
    const { name, style, bodyAreas, description, previewImage, transparentOverlay, difficulty, estTimeHours, estPriceRange, isFeatured } = req.body;

    const design = await TattooDesign.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      style,
      bodyAreas: Array.isArray(bodyAreas) ? bodyAreas : (bodyAreas ? bodyAreas.split(',').map(b => b.trim()) : ['Forearm']),
      description,
      previewImage,
      transparentOverlay: transparentOverlay || '',
      difficulty: difficulty || 'Intermediate',
      estTimeHours: estTimeHours || 3,
      estPriceRange: estPriceRange || '$250 - $450',
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json({ success: true, design });
  } catch (error) {
    next(error);
  }
};

export const updateDesign = async (req, res, next) => {
  try {
    let design = await TattooDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }

    if (typeof req.body.bodyAreas === 'string') {
      req.body.bodyAreas = req.body.bodyAreas.split(',').map(b => b.trim());
    }

    design = await TattooDesign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, design });
  } catch (error) {
    next(error);
  }
};

export const deleteDesign = async (req, res, next) => {
  try {
    const design = await TattooDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }
    await design.deleteOne();
    res.json({ success: true, message: 'Design deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeDesign = async (req, res, next) => {
  try {
    const design = await TattooDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ success: false, message: 'Design not found' });
    }
    design.likes = (design.likes || 0) + 1;
    await design.save();
    res.json({ success: true, likes: design.likes });
  } catch (error) {
    next(error);
  }
};
