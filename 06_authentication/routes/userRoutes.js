// NOTES: This module maps HTTP methods and URL paths to controller functions.
// It is mounted at "/" by index.js, so these paths are application-level paths.
// The router defines endpoint wiring only; request parsing is configured by the
// application and the actual account operations live in the controller module.
const express = require('express');
const{handleUserSignUp, handleUserLogin, handleGetUsers} = require('../controllers/userController');
const router = express.Router();

// POST /register creates an account; POST /login validates credentials and
// sets the authentication cookie. express.json() in index.js parses their bodies.
router.post('/register', handleUserSignUp);
router.post('/login',handleUserLogin);
// The login page uses fetch to submit JSON to POST /login; its form's action
// attribute is not used when the page's submit handler calls preventDefault().
http://localhost:7001/login
// GET /users returns the user documents currently stored in MongoDB.
// This route currently has no role middleware attached.
router.get('/users',handleGetUsers);

// Export the configured router so index.js can mount it on the app.
module.exports = router;