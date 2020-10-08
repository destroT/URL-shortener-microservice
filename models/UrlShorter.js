const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
	original_url: {
		type: String,
		default: 'point',
	},
	short_url: Number,
});

module.exports = mongoose.model('UrlShortener', urlSchema);
