import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ink_carvers_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        savedDesigns: user.savedDesigns,
        favoriteArtists: user.favoriteArtists,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const input = email.trim().toLowerCase();
    
    // Support admin@landofgod, admin@landofgodtattoos.com, admin@landofgod.com, and phone
    const isLandOfGodAdmin = input === 'admin@landofgod' || 
                             input === 'admin@landofgod.com' || 
                             input === 'admin@landofgodtattoos.com' ||
                             input === '7807966080' ||
                             input === '+917807966080';

    let user;
    if (isLandOfGodAdmin) {
      user = await User.findOne({
        $or: [
          { email: 'admin@landofgodtattoos.com' },
          { email: 'admin@landofgod.com' },
          { phone: '+91 78079 66080' },
          { role: 'admin' }
        ]
      }).select('+password');
    } else {
      user = await User.findOne({ email: input }).select('+password');
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        savedDesigns: user.savedDesigns,
        favoriteArtists: user.favoriteArtists,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDesigns')
      .populate('favoriteArtists');

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        savedDesigns: user.savedDesigns,
        favoriteArtists: user.favoriteArtists,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSaveDesign = async (req, res, next) => {
  try {
    const { designId } = req.params;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedDesigns.some(id => id.toString() === designId);
    if (isSaved) {
      user.savedDesigns = user.savedDesigns.filter(id => id.toString() !== designId);
    } else {
      user.savedDesigns.push(designId);
    }

    await user.save();
    res.json({
      success: true,
      isSaved: !isSaved,
      savedDesigns: user.savedDesigns,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavoriteArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const user = await User.findById(req.user._id);

    const isFav = user.favoriteArtists.some(id => id.toString() === artistId);
    if (isFav) {
      user.favoriteArtists = user.favoriteArtists.filter(id => id.toString() !== artistId);
    } else {
      user.favoriteArtists.push(artistId);
    }

    await user.save();
    res.json({
      success: true,
      isFavorite: !isFav,
      favoriteArtists: user.favoriteArtists,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};
