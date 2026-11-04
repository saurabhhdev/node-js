const URL = require('../models/url');

// Create a short code and save the destination URL supplied by the browser.
async function handleGenerateNewShortURL(req,res) {
    // Check both type and trimmed content because JSON input can be missing or blank.
    const submittedUrl = req.body?.url;
    if (typeof submittedUrl !== 'string' || !submittedUrl.trim()) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Browsers need a scheme to recognize an external address as a destination.
    let redirectURL = submittedUrl.trim();
    if (!/^https?:\/\//i.test(redirectURL)) {
        redirectURL = `https://${redirectURL}`;
    }

    // URL parses and normalizes the address; only web protocols are accepted.
    try {
        const parsedURL = new globalThis.URL(redirectURL);
        if (!['http:', 'https:'].includes(parsedURL.protocol)) {
            return res.status(400).json({ error: 'URL must use HTTP or HTTPS' });
        }
        redirectURL = parsedURL.href;
    } catch {
        return res.status(400).json({ error: 'Enter a valid URL' });
    }

    // nanoid is dynamically imported because the installed package exposes an ES module.
    const { nanoid } = await import('nanoid');
    const shortID = nanoid(8);
    // Save the short code, destination, and an empty click-history array as one document.
    await URL.create({
        shortId: shortID,
        redirectURL,
        visitHistory: [],
    });

    return res.json({ id: shortID, url: redirectURL });
}


// Look up a short code, record this visit, then send the browser to its destination.
async function handleGetNewURL(req,res) {
    const shortId = req.params.shortId;
    // findOneAndUpdate returns the matching document; the update appends a click timestamp.
    const entry = await URL.findOneAndUpdate({
        shortId
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    },
);
// Unknown codes must return a not-found response instead of accessing a null document.
if (!entry) {
    return res.status(404).send('Short URL not found');
}
// Express sends an HTTP redirect using the destination stored in the URL document.
return res.redirect(entry.redirectURL);
}


// Return the click count and timestamps for one short code without redirecting.
async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    // A missing code has no analytics, so return a clear 404 response.
    if (!result) {
        return res.status(404).json({ error: 'Short URL not found' });
    }
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}



module.exports = {
    handleGenerateNewShortURL,
    handleGetNewURL,
    handleGetAnalytics,
}