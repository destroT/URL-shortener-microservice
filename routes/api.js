const express = require('express');
const router = express.Router();

const UrlModel = require('../models/UrlShorter');

function prepareUrl(str) {
	str = str.trim();
	return str.replace(/^https:\/\//, '');
}

function checkUrl(str) {
	const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
	const regex = new RegExp(expression);
	if (!str.match(regex)) return false;
	return true;
}

// Check the URL and add the protocol if needed
function hasProtocol(str) {
	try {
		new URL(str).catch(e => console.log(e));
		return true;
	} catch (error) {
		return false;
	}
}

// Receive Original URL and return URL shortened
router.post('/shorturl/new', async (req, res) => {
	let { url } = req.body;
	if (!url) return res.status(400).json({ error: 'No input data' });
	//Prepare URL
	const tempUrl = prepareUrl(url);
	if (!hasProtocol(url)) url = 'http://' + url;

	// Check if is valid URL
	if (!checkUrl(tempUrl)) {
		res.json({ error: 'invalid URL' });
		return;
	}

	// Useful vars
	let shortVal = 1;
	UrlModel.findOne({})
		.sort({ short: 'desc' })
		.limit(1)
		.exec((err, data) => {
			if (data) shortVal = data.short + 1;
		});

	await UrlModel.findOne({ original: url }, async (err, data) => {
		if (!err && data != undefined) {
			// console.log('found');
			// console.log(data);
			return res.json({
				original_url: data.original,
				short_url: data.short,
			});
		}
		if (!err) {
			const newShortened = new UrlModel({
				original: url,
				short: shortVal,
			});
			try {
				const savedShortened = await newShortened.save();
				console.log(`New short url created ${savedShortened}`);
				return res.json({
					original_url: savedShortened.original,
					short_url: savedShortened.short,
				});
			} catch (error) {
				console.log('Internal error');
				return res.json({
					error: 'No short URL found for the given input',
				});
			}
		}
	});
});

// ShortURL Redirect
router.get('/shorturl/:id', async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ error: 'Invalid data' });

	const data = await UrlModel.findOne({ short: Number(id) });

	//console.log(data);
	if (!data) return res.json({ error: 'Invalid URL' });

	console.log(
		`Redirecting ${req.connection.remoteAddress} to ${data.original}`,
	);
	res.redirect(data.original);
	// Find the shortURL
});

module.exports = router;
