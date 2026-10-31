// NOTES: Mongoose model describing user records stored in MongoDB. Controllers
// import this model to create new accounts and query existing credentials.
const mongoose = require('mongoose');

// Each field below is a schema rule used when creating and querying users.
// Mongoose applies these rules when it validates documents for persistence.
const userSchema = new mongoose.Schema({
     username: {
        type: String,
        required: true,
        // MongoDB enforces uniqueness through an index; duplicate usernames
        // therefore cannot be stored successfully once the index is in place.
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // Only these two role labels are accepted; new accounts default to free.
        enum: ['free', 'premium'],
        default: 'free'
    }
});

// Mongoose uses this model name to associate documents with the users collection;
// importing the model provides the methods used by the controllers.
module.exports = mongoose.model('User',userSchema);