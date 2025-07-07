const DOM = {
	body: null,
	extendBtn: null,
};

// prepare DOM and restore data
const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	DOM.body = document.body;
	DOM.extendBtn = document.querySelector('.timebox__btn');
};

const prepareDOMEvents = () => {
	DOM.extendBtn.addEventListener('click', extendData);
};

const extendData = () => {
	DOM.body.classList.contains('extend')
		? DOM.body.classList.remove('extend')
		: DOM.body.classList.add('extend');
};

document.addEventListener('DOMContentLoaded', main);
