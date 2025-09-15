const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/bitacora');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const storageImplementation = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/implementation');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadBitacora = multer({ storage });
const uploadImplementation = multer({ storage: storageImplementation });

module.exports = { uploadBitacora, uploadImplementation };