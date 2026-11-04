const mongoose = require('mongoose');

// Keep database connection setup in one place so the server can await it at startup.
async function connectToMongoDB(url) {
    // mongoose.connect resolves after establishing the connection or rejects on failure.
    return mongoose.connect(url);
}

module.exports = {
    connectToMongoDB,

};