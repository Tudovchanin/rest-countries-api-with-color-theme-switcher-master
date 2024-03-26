const containerSelect = document.querySelector('.container-select');
const selectRegion = document.getElementById('filter-region');
const inputSearch = document.querySelector('.input-search');
const btnTheme = document.getElementById('theme-toggle');


document.addEventListener('click', async (event) => {
	const target = event.target;
	if (target.classList.contains('border-countries')) {
		const data = await useCachedData();
		showCountryDetailsByBorderingCountry(data, target.textContent);
	}
});
btnTheme.addEventListener('click', () => {
	switchTheme(inputSearch);
});
inputSearch.addEventListener('keyup', async (event) => {
	if (event.code === 'Enter') {
		const data = await useCachedData();
		searchCountry(data, inputSearch.value);
	}
});
selectRegion.addEventListener("change", async () => {
	const data = await useCachedData();
	const label = document.querySelector('.label');
	label.classList.add('hidden')
	getCountries(data)
});


function switchTheme(inputSearch) {
	const body = document.body;
	const elements = document.querySelectorAll('.common');
	const iconTheme = document.querySelector('.icon');
	elements.forEach(elem => {

		if (elem.classList.contains('common')) {
			if (elem.classList.contains('black')) {
				addTheme(elem, 'white');
				removeTheme(body, 'body-black-theme');
				removeTheme(elem, 'black');
				removeTheme(inputSearch, 'search-black-theme');
				removeTheme(iconTheme, 'icon-black-theme');

			} else {
				removeTheme(elem, 'white');
				addTheme(body, 'body-black-theme');
				addTheme(elem, 'black');
				addTheme(inputSearch, 'search-black-theme');
				addTheme(iconTheme, 'icon-black-theme');
			}
		}
	});
}
function addTheme(elem, value) {
	elem.classList.add(value);
}
function removeTheme(elem, value) {
	elem.classList.remove(value);
}


async function fetchDataFromServer() {
	try {
		const response = await fetch('https://restcountries.com/v3.1/all');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка:', error);
	}
}
async function getCachedData() {
	const cachedData = window.sessionStorage.getItem('cachedData');

	if (cachedData) {
		return JSON.parse(cachedData);
	} else {
		const data = await fetchDataFromServer();
		window.sessionStorage.setItem('cachedData', JSON.stringify(data));
		return data;
	}
}
async function useCachedData() {
	const cachedData = await getCachedData();
	return cachedData;
}


function searchCountry(data, value) {
	data.forEach(country => {
		if (value.toLowerCase() === country.name.common.toLowerCase()) {
			removeAllContent();
			showCountriesDetails(country);
		}
	})
}
function getCountries(data) {
	removeAllContent();

	data.forEach(country => {
		if (country.region === selectRegion.value) {
			showCountries(country);
		} else if (selectRegion.value === '') {
			const label = document.querySelector('.label');
			label.classList.remove('hidden');
		}
	});
}
function showCountries(country) {
	const countriesContainer = document.getElementById('countries');
	const containerFlagAndInfo = document.createElement('div');
	containerFlagAndInfo.classList.add('container-flag-info');
	containerFlagAndInfo.classList.add('common');

	if (btnTheme.classList.contains('white')) {
		containerFlagAndInfo.classList.add('white');
	} else {
		containerFlagAndInfo.classList.add('black');
	}


	const containerInfo = document.createElement('div');
	containerInfo.classList.add('country-info');

	const countryName = document.createElement('h2');
	countryName.textContent = country.name.common;

	const countryPopulation = document.createElement('p');
	countryPopulation.innerHTML = `<p><span class="font-bold">Population:</span> ${country.population}</p>`;

	const countryRegion = document.createElement('p');
	countryRegion.innerHTML = `<p><span class="font-bold">Region:</span> ${country.region}</p>`;

	const countryCapital = document.createElement('p');
	countryCapital.innerHTML = `<p><span class="font-bold">Capital:</span> ${country.capital}</p>`;

	const flagImg = document.createElement('img');
	flagImg.classList.add('country-flag');
	flagImg.src = country.flags.svg;

	flagImg.addEventListener('click', () => {
		removeAllContent()
		showCountriesDetails(country)
	})

	containerFlagAndInfo.appendChild(flagImg);

	containerInfo.appendChild(countryName);
	containerInfo.appendChild(countryPopulation);
	containerInfo.appendChild(countryRegion);
	containerInfo.appendChild(countryCapital);

	containerFlagAndInfo.appendChild(containerInfo);

	countriesContainer.appendChild(containerFlagAndInfo);
}
function showCountriesDetails(country) {

	hideElements([containerSelect, inputSearch]);

	const data = [['Native Name: ', country.name.common],
	['Population: ', country.population],
	['Region: ', country.region],
	['Sub Region: ', country.subregion],
	['Capital: ', country.capital],
	['Top Level Domain: ', country.tld[0]],
	['Currencies: ', Object.values(country.currencies)[0].name], ['Languages: ', Object.values(country.languages)]];


	const countriesContainer = document.getElementById('countries');
	countriesContainer.classList.add('container-details-country');

	const buttonBack = document.createElement('button');
	buttonBack.classList.add('border-countries', 'btn-back', 'common');
	if (btnTheme.classList.contains('white')) {
		buttonBack.classList.add('white');
	} else {
		buttonBack.classList.add('black');
	}
	buttonBack.textContent = 'Back';
	buttonBack.addEventListener('click', async () => {
		showElements([inputSearch, containerSelect]);
		const data = await useCachedData();
		getCountries(data);
	});


	const containerFlag = document.createElement('div');
	containerFlag.classList.add('container-flag-details');
	const flagImg = document.createElement('img');
	flagImg.classList.add('flag-big');
	flagImg.src = country.flags.svg;

	const containerInfo = document.createElement('div');
	containerInfo.classList.add('container-info-details');
	const headerTitle = document.createElement('h1');
	headerTitle.textContent = country.name.common;

	const mainText = document.createElement('div');
	mainText.classList.add('country-details-main');
	const mainText__left = document.createElement('div');
	const mainText__right = document.createElement('div');

	const footerContent = document.createElement('div');
	footerContent.classList.add('footer-content');

	const footerTitle = document.createElement('h3');
	footerTitle.classList.add('footer-title');
	footerTitle.textContent = 'Border Countries:';

	if (country.borders) {
		for (let index = 0; index < country.borders.length; index++) {
			footerContent.insertAdjacentHTML('beforeend', `<span class='border-countries common ${btnTheme.classList.contains('white') ? 'white' : 'black'}'>${country.borders[index]}</span>`);
		}
	} else {
		footerContent.innerHTML = '<p>No Borders</p>'
	}

	for (let index = 0; index < data.length; index++) {
		let secondElement = Array.isArray(data[index][1]) ? data[index][1].join(', ') : data[index][1];
		if (index > 4) {
			mainText__right.insertAdjacentHTML('beforeend', `<p><span class='font-bold'>${data[index][0]}</span>${secondElement}</p>`);
			continue;
		}
		mainText__left.insertAdjacentHTML('beforeend', `<p><span class='font-bold'>${data[index][0]}</span>${secondElement}</p>`);
	}

	containerFlag.appendChild(buttonBack);
	containerFlag.appendChild(flagImg);

	containerInfo.appendChild(headerTitle);

	mainText.appendChild(mainText__left);
	mainText.appendChild(mainText__right);
	containerInfo.appendChild(mainText);

	footerContent.insertBefore(footerTitle, footerContent.firstChild);
	containerInfo.appendChild(footerContent);

	countriesContainer.appendChild(containerFlag);
	countriesContainer.appendChild(containerInfo);
}
function showCountryDetailsByBorderingCountry(dada, borderingCountry) {
	dada.forEach(country => {
		if (country.cca3 === borderingCountry) {
			removeAllContent();
			showCountriesDetails(country);
		}
	})
}
function hideElements(arr) {
	for (let index = 0; index < arr.length; index++) {
		arr[index].style.display = 'none';
	}
}
function showElements(arr) {
	for (let index = 0; index < arr.length; index++) {
		arr[index].style.display = '';
	}
}
function removeAllContent() {
	const countriesContainer = document.getElementById('countries');
	countriesContainer.innerHTML = '';
}

