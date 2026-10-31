// NOTES: Application entry point for the authentication example.
// This file creates the Express app, installs request middleware, connects to
// MongoDB, and only then starts listening for incoming HTTP requests.
// The request path is: parsers -> authentication lookup -> protected page
// routes -> public static files -> API routes.

// Express handles HTTP routing and middleware; Mongoose provides MongoDB access.
const express = require('express');
const mongoose = require('mongoose');
// Resolve the public directory relative to this file so startup works from any
// current working directory.
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const cookieparser = require('cookie-parser');
const {checkForAuthentication , restrictTo} = require('./middlewares/mid');

// The app object is the central Express instance to which middleware and routes
// are attached. Creating it does not open the network listener yet.
const app = express();

// The server listens on this port once the database connection is established.
const PORT = 7001;

// NOTES: Install parsers before routes and authentication checks. The JSON
// parser populates req.body for API requests; cookie-parser populates req.cookies
// so the login middleware can read the browser's "uid" cookie.
app.use(cookieparser());
app.use(express.json());
app.use(checkForAuthentication);

// NOTES: These explicit routes run before static-file serving, so the pages
// are intended to require a valid token and the matching role. The middleware
// reads the decoded role from req.user before the corresponding file is sent.
app.get('/free.html', restrictTo(['free']), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'free.html'));
});
app.get('/premium.html', restrictTo(['premium']), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'premium.html'));
});
app.get('/home.html', restrictTo(['free', 'premium']), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// NOTES: Static assets (including signup page) are served from ./public.
// The /register alias serves that directory too, while /login explicitly uses
// login.html as its default document. Earlier explicit routes take precedence
// for the protected role-specific HTML pages.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/register', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public'), {
    index: 'login.html',
}));

// NOTES: Mount the routes after the common parsers and static page handlers.
// The route module defines registration, login, and user-list endpoints. The
// static middleware above only serves files for matching GET requests; API
// POST requests continue to this router.
app.use('/', userRoutes);

// NOTES: Connect to the local MongoDB database before accepting requests. The
// promise's success handler starts the listener; its failure handler reports
// the connection error and leaves the server stopped.
mongoose.connect('mongodb://127.0.0.1:27017/authapp-db')
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server started at ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });