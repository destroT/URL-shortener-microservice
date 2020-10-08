const { response } = require('express');
const express = require('express');
const router = express.Router();

const UrlModel = require('../models/UrlShorter');

function is_validURL(str) {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i',
	); // fragment locator
	return !!pattern.test(str);
}

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

// Receive Original URL and return URL shortened
router.post('/shorturl/new', async (req, res) => {
	let { url } = req.body;
	//Prepare URL
	const tempUrl = prepareUrl(url);

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
			console.log(data);
			if (data) shortVal = data.short + 1;
		});

	console.log(`Max SHortened ${shortVal}`);

	await UrlModel.findOne({ original: url }, async (err, data) => {
		if (!err && data != undefined) {
			console.log('found');
			console.log(data);
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
				console.log(savedShortened);
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

	const data = await UrlModel.findOne({ short: id });
	console.log(data);
	if (!data) return res.json({ error: 'Invalid URL' });

	res.redirect(data.original);
	// Find the shortURL
});

module.exports = router;
