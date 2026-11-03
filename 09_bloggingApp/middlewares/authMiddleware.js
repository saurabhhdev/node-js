const { validateToken } = require('../utlis/userAuth');

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Invalid token, clear the cookie
            res.clearCookie(cookieName);
        }

        return next();
    };
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
}

module.exports = {
    checkForAuthenticationCookie,
    requireAuth,
};