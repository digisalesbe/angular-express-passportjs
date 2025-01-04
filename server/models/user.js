const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', userScheme);

