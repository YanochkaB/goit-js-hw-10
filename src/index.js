import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';



const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info')

countryList.style.listStyle = 'none';
//умови:   (Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, 
//         а розмітка списку країн або інформації про країну зникає.)
//1 якщо >10 країн то повідомлення "Too many matches found. Please enter a more specific name."
//2 від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн
//3 Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.
//4 жодної, обробка помилки "Oops, there is no country with that name"

searchBox.addEventListener(
    'input',
    debounce(evt => {
        const trimForValue = searchBox.value.trim();
        //очистити поля
        clearQueryWindow();
        if (trimForValue !== '') {
            fetchCountries(trimForValue).then(data => {
                if (data.length > 10) {
                    Notiflix.Notify.info(
                        'Too many matches found. Please enter a more specific name.'
                        , { timeout: 1500 }
                    );
                } else if (data.length >= 2 && data.length <= 10) {
                    renderCountryList(data);
                } else if (data.length === 1) {
                    renderOneCounrty(data);
                } else if (data.length === 0) {
                    Notiflix.Notify.failure(
                        'Oops, there is no country with that name'
                        , { timeout: 1500 }
                    );
                }
            })
        }
    }, DEBOUNCE_DELAY));

    
function clearQueryWindow() {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}

// const xhr = new XMLHttpRequest()
// xhr.open('get', 'https://restcountries.com/v2/name/{name}');
// xhr.addEventListener('load', (evt) => {
//     if (xhr.status !== 200) return
//     console.log(JSON.parse(xhr.responseText))
// })
// xhr.send()
// const refs = {
//   searchBox: document.getElementById('search-box'),
//   countryList: document.querySelector('ul.country-list'),
//   countryInfo: document.querySelector('div.country-info'),
// };
// searchBox.addEventListener( 'click', () => {
//   fetchCountry()
//     .then((country) => renderCountryList(country))
//     .catch((error) => console.log(error));
// });
// function fetchCountry() {
//     return fetch('https://restcountries.com/v2/name/{name}')
//         .then(
//             (response) => {
//         if (!response.ok) {
//             throw new Error(response.status)
//         }
//         return response.json()
//         }
//     )
// };

function renderCountryList(countries) {
    const markup = countries
        .map((country) => {
            return `<li style="margin-bottom: 10px;">
            <img src="${country.flags.svg}" 
                alt="Flag of ${country.name.official}" 
                width="30" height="20">
            <b>${country.name.official}</b>
            </li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

function renderOneCounrty(countries) {
    const markup = countries
        .map((country) => {
            return `<li>
            <h1><img src="${country.flags.svg}" 
                alt="Flag of ${country.name.official}" 
                width="30" height="20">
            ${country.name.official}</h1>
            
            <p><b>capital: </b>${country.capital}</p>
            <p><b>population: </b>${country.population}</p>
            <p><b>languages: </b>${Object.values(country.languages)}</p>
            </li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

// const Base_URL = 'https://restcountries.com/v3.1/name/'
// const fields = 'fields=name,capital,population,flags,languages'
    
// export function fetchCountries(name) {
//     return fetch(`${Base_URL}${name}?${fields}`)
//         .then(response => response.json())
//         .catch(error => console.log('error'))
// };

