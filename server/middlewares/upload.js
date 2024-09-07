const multer = require('multer');
const path = require('path');

// Définir le stockage avec une destination dynamique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Request URL:', req.originalUrl);

    let uploadPath = '';
    if (req.originalUrl.includes('upload-image-publication')) {
      uploadPath = './uploads/publications';
    } else if (req.originalUrl.includes('upload-image-user')) {
      uploadPath = './uploads/users';
    } else {
      return cb(new Error('Unknown upload path'), false);
    }
    
    console.log('Upload path:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = Date.now() + fileExt;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
