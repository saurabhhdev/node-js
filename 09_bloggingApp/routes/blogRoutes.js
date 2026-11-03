const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();
const imageTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const uploadDirectory = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            String(req.user.id)
        );
        fs.mkdir(uploadDirectory, { recursive: true }, (error) => {
            callback(error, uploadDirectory);
        });
    },
    filename(req, file, callback) {
        callback(null, `${crypto.randomUUID()}${imageTypes[file.mimetype]}`);
    },
});

const uploadPhoto = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!imageTypes[file.mimetype]) {
            return callback(new Error('Upload a JPEG, PNG, GIF, or WebP image.'));
        }
        return callback(null, true);
    },
});

function handlePhotoUpload(req, res, next) {
    uploadPhoto.single('coverImage')(req, res, (error) => {
        if (error) {
            return res.status(400).render('addBlog', {
                title: 'Add a Blog',
                user: req.user,
                error: error.message,
            });
        }
        return next();
    });
}

router.get('/add-new', requireAuth, (req, res) => {
    res.render('addBlog', { title: 'Add a Blog', user: req.user });
});
router.post('/create', requireAuth, handlePhotoUpload, blogController.createBlog);
router.post('/edit/:id', requireAuth, blogController.updateBlog);
router.post('/delete/:id', requireAuth, blogController.deleteBlog);
router.post('/like/:id', requireAuth, blogController.likeBlog);
router.get('/:id', blogController.getBlog);

module.exports = router;
