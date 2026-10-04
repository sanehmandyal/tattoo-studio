import Aftercare from '../models/Aftercare.js';

export const getAftercare = async (req, res, next) => {
  try {
    const aftercare = await Aftercare.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, count: aftercare.length, aftercare });
  } catch (error) {
    next(error);
  }
};

export const createAftercare = async (req, res, next) => {
  try {
    const { title, icon, category, shortDescription, detailedSteps, sortOrder } = req.body;

    const doc = await Aftercare.create({
      title,
      icon: icon || 'ShieldCheck',
      category,
      shortDescription,
      detailedSteps: Array.isArray(detailedSteps) ? detailedSteps : (detailedSteps ? detailedSteps.split('\n').filter(Boolean) : []),
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ success: true, aftercare: doc });
  } catch (error) {
    next(error);
  }
};

export const updateAftercare = async (req, res, next) => {
  try {
    let doc = await Aftercare.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Aftercare item not found' });
    }

    if (typeof req.body.detailedSteps === 'string') {
      req.body.detailedSteps = req.body.detailedSteps.split('\n').filter(Boolean);
    }

    doc = await Aftercare.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, aftercare: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteAftercare = async (req, res, next) => {
  try {
    const doc = await Aftercare.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Aftercare item not found' });
    }
    await doc.deleteOne();
    res.json({ success: true, message: 'Aftercare guide removed' });
  } catch (error) {
    next(error);
  }
};
