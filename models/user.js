const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    countryCode: String
}, {
    timestamps: true
});

const userSchema = new Schema({
    name: { type: String },
    email: { type: String },
    avatar: { type: String },
    googleId: { type: String },
    favorites: [favoriteSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);