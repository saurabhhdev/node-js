const mongoose = require('mongoose');

// A schema describes the fields Mongoose stores and validates for each shortened URL.
const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [{
        // Store each click time as a number (milliseconds since the Unix epoch).
        timestamp: {type: Number}
    }],
});

// The model provides database operations for the URL collection.
const URL = mongoose.model('url',urlSchema);

module.exports = URL;