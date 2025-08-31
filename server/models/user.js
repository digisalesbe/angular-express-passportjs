const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name:     { type: String, required: true},
    status:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userScheme);
