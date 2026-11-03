const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const router = Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

const imageExtensions = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};

const profileImageUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback) {
            const directory = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
            fs.mkdir(directory, { recursive: true }, (error) => callback(error, directory));
        },
        filename(req, file, callback) {
            callback(null, `${crypto.randomUUID()}${imageExtensions[file.mimetype]}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!imageExtensions[file.mimetype]) {
            return callback(new Error('Choose a JPEG, PNG, GIF, or WebP profile image.'));
        }
        return callback(null, true);
    },
});

function handleProfileImage(req, res, next) {
    profileImageUpload.single('profileImage')(req, res, (error) => {
        if (error) {
            return res.status(400).render('signup', {
                title: 'Register',
                error: error.message,
            });
        }
        return next();
    });
}

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Register' });
});

router.get('/signin', (req, res) => {
    res.render('login', { title: 'Sign In' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In' });
});

router.post('/signup', handleProfileImage, userController.signup);
router.post(['/signin', '/login'], userController.login);
router.post('/logout', userController.logout);
router.get('/profile', requireAuth, userController.getProfile);

module.exports = router;
