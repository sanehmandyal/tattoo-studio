import Contact from '../models/Contact.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and your inquiry message' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Studio Inquiry',
      message,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our studio director will reply within 24 hours.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) {
      contact.status = status;
      if (status === 'responded') {
        contact.respondedAt = new Date();
      }
    }
    if (internalNotes !== undefined) {
      contact.internalNotes = internalNotes;
    }

    await contact.save();
    res.json({ success: true, message: 'Inquiry updated', contact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    await contact.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
};
