const express = require('express');
const router = express.Router();
const { handleGenerateNewShortURL, handleGetNewURL, handleGetAnalytics } = require('../controllers/urlController');

// POST on the router root creates a short URL; the server mounts this at /url.
router.post('/', handleGenerateNewShortURL);

// Register the more specific analytics path before /:shortId so "analytics" is not
// interpreted as a short code segment.
router.get('/analytics/:shortId',handleGetAnalytics);

// Any remaining one-segment GET path is treated as a short code to redirect.
router.get('/:shortId',handleGetNewURL);

module.exports = router;
