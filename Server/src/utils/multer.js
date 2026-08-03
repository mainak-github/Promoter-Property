const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Root uploads folder
const rootPath = path.join(__dirname, '../../uploads/brokers');

// Ensure the base folder exists
if (!fs.existsSync(rootPath)) {
  fs.mkdirSync(rootPath, { recursive: true });
}

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    agreementFile: ['application/pdf'],
    profilePhoto: ['image/jpeg', 'image/png', 'image/jpg']
  };

  const allowed = allowedTypes[file.fieldname]?.includes(file.mimetype);
  if (allowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `${file.fieldname} must be a ${file.fieldname === 'agreementFile' ? 'PDF' : 'JPG/PNG image'}`
      )
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name } = req.body;
    const userId = req.params?.id || req.body.userId || 'temp';

    const folderName = `${userId}_${name?.replace(/\s+/g, '_') || 'unknown'}`;
    const uploadPath = path.join(rootPath, folderName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fieldName = file.fieldname;

    const filename = fieldName === 'agreementFile' ? `agreement${ext}` : `profile${ext}`;
    cb(null, filename);
  }
});

// 5MB per file limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
