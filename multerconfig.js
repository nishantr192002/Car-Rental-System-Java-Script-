const multer = require('multer');
const path = require('path');

// Set up storage for photos and videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = file.mimetype.startsWith('image/') ? 'uploads/photos' : 'uploads/videos';
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
