const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
	original: {
		type: String,
	},
	short: Number,
});

module.exports = mongoose.model('UrlShortener', urlSchema);
