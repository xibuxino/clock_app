const DOM = {
	body: null,
	extendBtn: null,
	quoteText: null,
	quoteAuthor: null,
	quoteBtn: null,
};



const API_QUOTE_URL = 'https://api.api-ninjas.com/v1/quotes';
const API_QUOTE_KEY = 'yeH6ouTl51ssbZue2aUfcQ==jWcZBPu7RzPa2TIl';

// prepare DOM and restore data
const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
	fetchQuote();
};

const prepareDOMElements = () => {
	DOM.body = document.body;
	DOM.extendBtn = document.querySelector('.timebox__btn');
	DOM.quoteText = document.querySelector('.quote__text');
	DOM.quoteAuthor = document.querySelector('.quote__author');
	DOM.quoteBtn = document.querySelector('.quote__btn');
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
		const response = await fetch(API_QUOTE_URL, {
			method: 'GET',
			headers: { 'X-Api-Key': API_QUOTE_KEY },
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}`);
		}

		const data = await response.json();
		newQuote(data);
	} catch (error) {
		console.log(`Błąd`);
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

document.addEventListener('DOMContentLoaded', main);
