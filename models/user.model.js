// models/user.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // No two users can have the same email
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
    // You could add more fields here like 'name' or 'address'
});

module.exports = mongoose.model('User', userSchema);