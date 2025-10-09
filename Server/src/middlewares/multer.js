// middleware/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.body.title) return cb(new Error('Title is required before uploading'));
    const slug = slugify(req.body.title, { lower: true });
    const basePath = path.join(__dirname, '..', 'uploads', 'properties', slug);

    const fieldMap = {
      coverPhoto: '',
      additionalPhotos: 'images',
      floorPlans: 'floorplans',
      developerLogo: 'developer',
      layoutMaps: 'layout'
    };

    const folder = fieldMap[file.fieldname] || '';
    const fullPath = path.join(basePath, folder);

    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });