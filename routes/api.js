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

// Receive Original URL and return URL shortened
router.post('/shorturl/new', async (req, res) => {
	// Check if is valid URL

	let { url } = req.body;
	//Modify URL
	url = url.trim();
	url = url.replace(/^https:\/\//, '');
	const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);

	if (!url.match(regex)) {
		res.json({ error: 'Invalid URL' });
		return;
	}

	// Useful vars
	let responseObject = { original_url: url };
	let inputShort = 1;

	// Check if the url is alredy be shortened or create one
	await UrlModel.findOne({})
		.sort({ short_url: 'desc' })
		.exec((error, result) => {
			if (!error && result != undefined) {
				inputShort = result.short_url + 1;
			}
			if (!error) {
				UrlModel.findOneAndUpdate(
					{ original_url: url },
					{ original_url: url, short_url: inputShort },
					{ upsert: true, useFindAndModify: false },
					(error, savedUrl) => {
						if (!error) {
							responseObject['original_url'] =
								savedUrl.original_url;
							responseObject['short_url'] = savedUrl.short_url;
							console.log(responseObject);
							res.json(responseObject);
						}
					},
				);
			}
		});
	responseObject = {};
});

// ShortURL Redirect
router.get('/shorturl/:id', (req, res) => {
	const { id } = req.query;

	// Find the shortURL
	res.json({ error: 'No short url' });
});

module.exports = router;
