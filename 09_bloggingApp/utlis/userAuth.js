const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function generateToken(user) {
    const payload = {
        id: user._id,
        role: user.role,
        username: user.username,
        profileImage: user.profileImage,
    };
    return jwt.sign(payload, secret);
}

function validateToken(token) {
    if(!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.verify(token, secret);
}

module.exports = {
    generateToken,
    validateToken,
}
