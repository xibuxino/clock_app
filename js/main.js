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

const API_IP_URL = 'https://free.freeipapi.com/api/json';
const API_IPLOOKUP_URL = 'https://ip-api.com/json/';
const API_NINJAS_KEY = 'yeH6ouTl51ssbZue2aUfcQ==jWcZBPu7RzPa2TIl';
const API_NINJAS_QUOTE_URL = 'https://api.api-ninjas.com/v1/quotes';
const API_NINJAS_TIME_URL = 'https://api.api-ninjas.com/v1/worldtime?';

let ip = '';
let lookup = {};
let time = {};
let date = { DateTime };

async function main() {
	prepareDOMElements();
	prepareDOMEvents();
	fetchQuote();
	await flow();
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

const fetchQuote = async () => {
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
		staticQuote();
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

const fetchUserIP = async () => {
	try {
		const response = await fetch(API_IP_URL);
		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}
		const data = await response.json();
		return data.ipAddress;
	} catch (error) {
		throw new Error(`Error ${response.status}`);
	}
};

const fetchLookup = async (ip) => {
	try {
		const response = await fetch(API_IPLOOKUP_URL + ip);
		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(`Error`, error);
		throw error;
	}
};

const flow = async () => {
	try {
		ip = await fetchUserIP();
		lookup = await fetchLookup('2a02:8071:1212:aa0:d914:e794:457d:1212');
		time = await fetchTime(lookup.lat, lookup.lon);
		date = DateTime.now().setZone(lookup.timezone).setLocale('en');
	} catch (error) {
		console.log(`Error`, error);
		throw error;
	}
};

const fetchTime = async (lat, lon) => {
	let url = API_NINJAS_TIME_URL + `lat=${lat}&lon=${lon}`;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'X-Api-Key': API_NINJAS_KEY },
		});
		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(`Error`, error);
		throw error;
	}
};

const assignData = () => {
	DOM.cityTxt.textContent = `in ${lookup.city}, ${lookup.country}`;
	DOM.timezoneTxt.textContent = lookup.timezone;
	DOM.shortTimeZone.textContent = date.offsetNameShort;
	DOM.timeTxt.textContent = `${time.hour}:${time.minute}`;
	DOM.greeting.textContent = setGreeting();
	DOM.dayOfTheWeek.textContent = date.toFormat('cccc');
	DOM.dateTxt.textContent = date.toLocaleString(DateTime.DATE_FULL);
	DOM.weekNumber.textContent = date.weekNumber;
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
document.addEventListener('DOMContentLoaded', main);
