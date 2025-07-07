import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/build/es6/luxon.min.js';

const DOM = {
	body: null,
	extendBtn: null,
	quoteText: null,
	quoteAuthor: null,
	quoteBtn: null,
	cityTxt: null,
	timezoneTxt: null,
	shortTimeZone: null,
	timeTxt: null,
	greeting: null,
	dayOfTheWeek: null,
	dateTxt: null,
	weekNumber: null,
};
const API_IP_KEY = 'ipb_live_UHWNdMKjfcfYpJ9NmqetMKheXKSxOsHzdAnntCVt';
const API_IP_URL = `https://api.ipbase.com/v2/info?apikey=${API_IP_KEY}`;
// const API_IP_URL = `https://api.ipbase.com/v2/info?apikey=${API_IP_KEY}&ip=`;
const API_NINJAS_KEY = 'yeH6ouTl51ssbZue2aUfcQ==jWcZBPu7RzPa2TIl';
const API_NINJAS_QUOTE_URL = 'https://api.api-ninjas.com/v1/quotes';

const API_REQUEST_DELAY = 60 * 60 * 1000;

let lookup = {};
let date;
let ip;
// const testIp = '180.228.172.138';
async function main() {
	prepareDOMElements();
	prepareDOMEvents();
	fetchQuote();
	// await fetchUserIP();
	await fetchUserIPData();
	assignData();
	setTheme();
	DOM.body.style.visibility = 'visible';
}

const prepareDOMElements = () => {
	DOM.body = document.body;
	DOM.extendBtn = document.querySelector('.timebox__btn');
	DOM.quoteText = document.querySelector('.quote__text');
	DOM.quoteAuthor = document.querySelector('.quote__author');
	DOM.quoteBtn = document.querySelector('.quote__btn');
	DOM.cityTxt = document.querySelector('.timebox__data-location');
	DOM.timezoneTxt = document.querySelector('.timezone');
	DOM.shortTimeZone = document.querySelector('.dt-short');
	DOM.timeTxt = document.querySelector('.time');
	DOM.greeting = document.querySelector('.greeting');
	DOM.dayOfTheWeek = document.querySelector('.week-day');
	DOM.dateTxt = document.querySelector('.date');
	DOM.weekNumber = document.querySelector('.week-num');
};

const prepareDOMEvents = () => {
	DOM.extendBtn.addEventListener('click', extendData);
	DOM.quoteBtn.addEventListener('click', fetchQuote);
};

const extendData = () => {
	DOM.body.classList.contains('extend')
		? DOM.body.classList.remove('extend')
		: DOM.body.classList.add('extend');
};

// quote
const quoteBtnLoading = (active) => {
	DOM.quoteBtn.classList.toggle('rotate', active);
};
const fetchQuote = async () => {
	quoteBtnLoading(true);
	try {
		const response = await fetch(API_NINJAS_QUOTE_URL, {
			method: 'GET',
			headers: { 'X-Api-Key': API_NINJAS_KEY },
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}
		const data = await response.json();

		newQuote(data);
	} catch (error) {
		console.log(error);
		staticQuote();
	} finally {
		quoteBtnLoading(false);
	}
};

const newQuote = (data) => {
	DOM.quoteText.textContent = data[0].quote;
	DOM.quoteAuthor.textContent = data[0].author;
};

const staticQuote = () => {
	DOM.quoteText.textContent = `If we get our self-esteem from superficial places, from our popularity, appearance, business success, financial situation, health, any of these, we will be disappointed, because no one can guarantee that we'll have them tomorrow.`;
	DOM.quoteAuthor.textContent = `Kathy Ireland`;
};

// const fetchUserIP = async () => {
// 	const cachedIp = localStorage.getItem('ip');
// 	const now = Date.now();
// 	if (cachedIp) {
// 		const parsed = JSON.parse(cachedIp);
// 		if (now - parsed.timestamp < API_REQUEST_DELAY) {
// 			console.log('localStorage ip used');
// 			ip = parsed.ip;
// 			return ip;
// 		}
// 	}
// 	console.log('new ip used');
// 	try {
// 		const response = await fetch(API_IP_URL);
// 		if (!response.ok) {
// 			throw new Error(`Error ${response.status}`);
// 		}
// 		const data = await response.json();
// 		ip = data.ip;
// 		localStorage.setItem('ip', JSON.stringify({ data: ip, timestamp: now }));
// 		return ip;
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };

// const fetchUserIPData = async () => {
// 	const cachedData = localStorage.getItem('ipData');
// 	const now = Date.now();
// 	if (cachedData) {
// 		const parsed = JSON.parse(cachedData);
// 		if (now - parsed.timestamp < API_REQUEST_DELAY) {
// 			console.log('localStorage data used');
// 			lookup = parsed.data;

// 			return lookup;
// 		}
// 	}
// 	console.log('new data used');
// 	try {
// 		const response = await fetch(API_IP_URL + testIp);
// 		if (!response.ok) {
// 			throw new Error(`Error ${response.status}`);
// 		}
// 		lookup = await response.json();

// 		localStorage.setItem(
// 			'ipData',
// 			JSON.stringify({ data: lookup, timestamp: now })
// 		);
// 		return lookup;
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };

const fetchUserIPData = async () => {
	const cachedData = localStorage.getItem('ipData');
	const now = Date.now();
	if (cachedData) {
		const parsed = JSON.parse(cachedData);
		if (now - parsed.timestamp < API_REQUEST_DELAY) {
			console.log('localStorage data used');
			lookup = parsed.data;
			ip = lookup.data.ip;
			return lookup;
		}
	}
	console.log('new data used');
	try {
		const response = await fetch(API_IP_URL);
		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}
		lookup = await response.json();
		ip = lookup.data.ip;
		localStorage.setItem(
			'ipData',
			JSON.stringify({ data: lookup, timestamp: now })
		);
		return lookup;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const setGreeting = () => {
	let hour = date.hour;

	let text =
		hour >= 5 && hour < 12
			? 'Good morning'
			: hour >= 12 && hour < 18
			? 'Good afternoon'
			: 'Good evening';
	return text;
};

const setTheme = () => {
	let hour = date.hour;
	if (hour >= 5 && hour < 18) {
		DOM.body.classList.remove('theme-night');
		DOM.body.classList.add('theme-day');
	} else {
		DOM.body.classList.add('theme-night');
		DOM.body.classList.remove('theme-day');
	}
};

const formatDate = () => {
	date = DateTime.now().setZone(lookup.data.timezone.id).setLocale('en');
};
const assignData = () => {
	formatDate();
	setInterval(() => {
		date = DateTime.now().setZone(lookup.data.timezone.id).setLocale('en');
		DOM.timeTxt.textContent = date.toFormat('HH:mm');
	},  1000);
	const city = `in ${lookup.data.location.city.name}, ${lookup.data.location.country.name}`;
	const timezone = lookup.data.timezone.id;
	const time = date.toFormat('HH:mm');
	DOM.cityTxt.textContent = city;

	DOM.timezoneTxt.textContent = timezone;
	DOM.shortTimeZone.textContent = date.offsetNameShort;
	DOM.timeTxt.textContent = time;
	DOM.greeting.textContent = setGreeting();
	DOM.dayOfTheWeek.textContent = date.toFormat('cccc');
	DOM.dateTxt.textContent = date.toLocaleString(DateTime.DATE_FULL);
	DOM.weekNumber.textContent = date.weekNumber;
};

document.addEventListener('DOMContentLoaded', main);
