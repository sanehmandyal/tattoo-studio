import express from 'express';
import { upload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  try {
    let fileUrl = '';
    
    // Read file from disk or buffer to construct persistent Base64 Data URL
    if (req.file.path && fs.existsSync(req.file.path)) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const mimeType = req.file.mimetype || 'image/jpeg';
      fileUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    } else if (req.file.buffer) {
      const mimeType = req.file.mimetype || 'image/jpeg';
      fileUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
    } else {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      fileUrl,
      localUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename || req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error('Upload processing error:', err);
    res.status(500).json({ success: false, message: 'Image processing failed' });
  }
});

export default router;
