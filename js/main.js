const DOM = {
	body: null,
	extendBtn: null,
	quoteText: null,
	quoteAuthor: null,
	quoteBtn: null,
	cityTxt: null,
	countryTxt: null,
	timezoneTxt: null,
};

const API_IP_URL = 'https://api.ipify.org/?format=json';
const API_IPLOOKUP_URL = 'http://ip-api.com/json/';
const API_NINJAS_KEY = 'yeH6ouTl51ssbZue2aUfcQ==jWcZBPu7RzPa2TIl';
const API_NINJAS_QUOTE_URL = 'https://api.api-ninjas.com/v1/quotes';
const API_NINJAS_TIME_URL = 'https://api.api-ninjas.com/v1/worldtime?city=';

let ip = '';
let lookup = {};
// prepare DOM and restore data
const main = async () => {
	prepareDOMElements();
	prepareDOMEvents();
	fetchQuote();
	await flow();
	assignData();
	console.log(lookup);
};

const prepareDOMElements = () => {
	DOM.body = document.body;
	DOM.extendBtn = document.querySelector('.timebox__btn');
	DOM.quoteText = document.querySelector('.quote__text');
	DOM.quoteAuthor = document.querySelector('.quote__author');
	DOM.quoteBtn = document.querySelector('.quote__btn');
	DOM.cityTxt = document.querySelector('.city');
	DOM.countryTxt = document.querySelector('.country');
	DOM.timezoneTxt = document.querySelector('.timezone');
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
		return data.ip;
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
		lookup = await fetchLookup(ip);
		console.log(ip, lookup);
	} catch (error) {
		console.log(`Error`, error);
		throw error;
	}
};

const assignData = () => {
	DOM.cityTxt.textContent = lookup.city;
	DOM.countryTxt.textContent = lookup.countryCode;
	DOM.timezoneTxt.textContent = lookup.timezone;
};
document.addEventListener('DOMContentLoaded', main);
