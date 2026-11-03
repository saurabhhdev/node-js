const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utlis/userAuth');
const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};

// SIGNUP USER

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.render('signup', {
                error: 'User with this email or username already exists'
            });
        }

        const user = new User({
            username,
            email,
            password,
            ...(req.file && { profileImage: `/uploads/profiles/${req.file.filename}` }),
        });
        await user.save();

        const token = generateToken(user);
        res.cookie('token', token, authCookieOptions);
        res.redirect('/dashboard');
    } catch (error) {
        res.render('signup', { error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.cookie('token', token, authCookieOptions);
        res.redirect('/dashboard');
    } catch (error) {
        res.render('login', { error: error.message });
    }
};

// Logout user
exports.logout = (req, res) => {
    res.clearCookie('token', authCookieOptions);
    res.redirect('/');
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};