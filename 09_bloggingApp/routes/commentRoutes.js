const express = require('express');
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Comment routes (all require authentication)
router.post('/:blogId', requireAuth, commentController.addComment);
router.post('/delete/:blogId/:commentId', requireAuth, commentController.deleteComment);

module.exports = router;