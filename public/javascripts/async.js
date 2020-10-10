// Initialize constants
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port;

const form = document.getElementById('send-request');
const link = document.getElementById('shortened');
const copyToClipboard = document.getElementById('copyToClipboard');
const results = document.getElementById('results');

// Initialize Toast
const notyf = new Notyf({
	duration: 5000,
	position: {
		x: 'right',
		y: 'top',
	},
});

// Initialize functions
const resultsHide = () => (results.style.visibility = 'hidden'); //Show-hide result div
const resultsShow = () => (results.style.visibility = 'visible');
const displayResult = str => {
	const shortened_url = `${protocol}//${hostname}:${port}/api/shorturl/${str}`;
	link.href = shortened_url;
	link.innerHTML = shortened_url;
}; // Change result link values

// Send request to server
const postHandler = e => {
	e.preventDefault();
	const body = new URLSearchParams({ url: form.url.value });

	axios
		.post(form.action, body)
		.then(res => {
			const data = res.data;
			if (data.short_url) {
				displayResult(data.short_url);
				resultsShow();
				notyf.success('🎉 Url created 🎉');
			}
			if (data.error) {
				resultsHide();
				notyf.error(`⛔ ${data.error} ⛔`);
			}
		})
		.catch(e => {});
};

// Create event listeners
form.addEventListener('submit', e => postHandler(e));
copyToClipboard.addEventListener('click', () => {
	window.navigator.clipboard.writeText(link.href);
	notyf.success('Link copied!');
});
