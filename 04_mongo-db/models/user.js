// Schema..

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    Age: {
        type: Number,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique:true,
    },

    jobTitle: {
        type: String,
        required: true,
    },
} , {timestamps:true}
);

// Model..

const User = mongoose.model('user',userSchema);

module.exports= User;