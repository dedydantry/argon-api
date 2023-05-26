const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'storage/'); // Upload destination folder
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename
    },
});

module.exports = storage