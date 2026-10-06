import TattooDesign from '../models/TattooDesign.js';

export const getDesigns = async (req, res, next) => {
  try {
    const { bodyArea, style, featured, referenceOnly } = req.query;
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
    if (referenceOnly === 'true') {
      query.isReferenceTattoo = true;
    }

    const designs = await TattooDesign.find(query).sort({ isDefaultReference: -1, isFeatured: -1, priority: -1, likes: -1, createdAt: -1 });
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
    const {
      name,
      style,
      bodyAreas,
      description,
      previewImage,
      transparentOverlay,
      difficulty,
      estTimeHours,
      estPriceRange,
      isFeatured,
      isDefaultReference,
      isReferenceTattoo,
      priority
    } = req.body;

    const formattedAreas = Array.isArray(bodyAreas) 
      ? bodyAreas 
      : (bodyAreas ? bodyAreas.split(',').map(b => b.trim()).filter(Boolean) : ['Forearm']);

    // If marked as default reference for these body areas, update other designs for the same areas
    if (isDefaultReference) {
      await TattooDesign.updateMany(
        { bodyAreas: { $in: formattedAreas } },
        { $set: { isDefaultReference: false } }
      );
    }

    const design = await TattooDesign.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      style: style || 'Geometric',
      bodyAreas: formattedAreas,
      description,
      previewImage,
      transparentOverlay: transparentOverlay || previewImage || '',
      difficulty: difficulty || 'Intermediate',
      estTimeHours: Number(estTimeHours) || 3,
      estPriceRange: estPriceRange || '₹3,500 - ₹6,500',
      isFeatured: Boolean(isFeatured),
      isDefaultReference: Boolean(isDefaultReference),
      isReferenceTattoo: isReferenceTattoo !== undefined ? Boolean(isReferenceTattoo) : true,
      priority: Number(priority) || 0,
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
      req.body.bodyAreas = req.body.bodyAreas.split(',').map(b => b.trim()).filter(Boolean);
    }

    if (req.body.isDefaultReference && req.body.bodyAreas && req.body.bodyAreas.length > 0) {
      await TattooDesign.updateMany(
        { _id: { $ne: design._id }, bodyAreas: { $in: req.body.bodyAreas } },
        { $set: { isDefaultReference: false } }
      );
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
