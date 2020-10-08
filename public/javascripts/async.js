const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port;
console.log(protocol);
const form = document.getElementById('send-request');
const link = document.getElementById('shortened');
const toast = document.getElementById('toast');

function displayResult(str) {
	const shortened_url =
		protocol + '//' + hostname + ':' + port + '/api/shorturl/' + str;
	console.log(shortened_url);
	link.href = shortened_url;

	link.innerHTML = shortened_url;
	link.style.display = 'block';
}

function showToast(message, color) {
	console.log('show toast');
	toast.innerHTML = message;
	toast.style.backgroundColor = `var(--${color})`;
	toast.className = show;
	setTimeout(() => {
		toast.className.replace('show', '');
	}, 3000);
}

form.addEventListener('submit', e => {
	e.preventDefault();

	const body = new URLSearchParams({ url: form.url.value });
	axios
		.post(form.action, body)
		.then(res => {
			const data = res.data;
			if (data.error) showToast(data.error, 'danger');
			if (data.short_url) displayResult(data.short_url);
		})
		.catch(e => console.log(e));
});
