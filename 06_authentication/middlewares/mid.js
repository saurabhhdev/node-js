// NOTES: Authentication and authorization middleware used by the app routes.
// cookie-parser must run before this module's authentication check so the
// parsed token cookie is available on req.cookies.
const {getUser} = require('../service/auth');


function  checkForAuthentication(req,res,next) {
    // Start unauthenticated for every request. This middleware currently uses
    // the "token" cookie; if it is absent, later role guards see no req.user.
    const tokenCookie = req.cookies?.token;
    req.user = null;
    if(!tokenCookie) return next();
       
       // Verify and decode the JWT. A successful lookup attaches its payload
       // to the request so restrictTo can inspect the user's role.
       const token = tokenCookie
       const user = getUser(token);
       req.user = user;
    return next();
}

function restrictTo(roles=[]) {
    return function(req,res,next) {
        // A missing user should be sent to the login page. This redirect is
        // followed by the role check in the current implementation.
        if(!req.user) res.redirect('/login');

        // Only the role labels listed by the route are allowed to continue.
        if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    };
}

// NOTES: Older cookie-based middleware kept here as a commented example; it is
// not active or exported. The active role guards above use checkForAuthentication
// to populate req.user and restrictTo to compare the user's role.
// async function restrictToLoggedInUserOnly(req,res,next) {
//     // Optional chaining avoids an error if cookie parsing did not provide a
//     // cookies object; in that case userUID is undefined and access is denied.
//     const userUID = req.cookies?.uid;

//     // Send unauthenticated visitors to the login page.
//     if(!userUID) return res.redirect('/login');
//     // getUser verifies the token and returns its decoded user payload. Invalid
//     // tokens are not accepted as authenticated identities.
//     const user = getUser(userUID);

//     // An invalid or expired token must not grant access.
//     if(!user) return res.redirect('/login');

//     // Make the authenticated user available to downstream handlers.
//     req.user = user;
//     next();
// }

// The route setup imports this named middleware to protect selected endpoints.
module.exports = {
    // restrictToLoggedInUserOnly,
    checkForAuthentication,
    restrictTo,
};