const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    // Keep original filename, but you could uniquify here
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDFs only by default; adjust as needed
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'));
};

module.exports = multer({ storage, fileFilter });
