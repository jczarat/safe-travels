const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema ({
    countryCode: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model('Country', countrySchema);