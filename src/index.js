import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

function getCountries(name) {
  fetchCountries(name)
    .then(data => {
      if (data.length === 1) {
        ul.innerHTML = '';
        renderMarkupSpecial(data);
      } else if (data.length >= 2 && data.length <= 10) {
        div.innerHTML = '';
        renderMarkup(data);
      } else {
        ul.innerHTML = '';
        div.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(() => {
      div.innerHTML = '';
      ul.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(data) {
  ul.style.listStyle = 'none';
  ul.style.paddingLeft = 0;
  data.map(item =>
    ul.insertAdjacentHTML(
      'afterbegin',
      `<li style="cursor: pointer";><p>
  <img width="20px" height="10px" src="${item.flags.svg}">
  ${item.name.common}<p/>`
    )
  );
}

function renderMarkupSpecial(data) {
  div.innerHTML = '';
  data.map(item =>
    div.insertAdjacentHTML(
      'afterbegin',
      `<p style=" font-size: 30px;
font-weight: bold;">
<a style="text-decoration: none; color: inherit" ">
<img width="60px" height="40px" src="${item.flags.svg}"> ${
        item.name.common
      }</a></p>
<p><span style="font-weight: bold">Capital:</span> ${item.capital}</p>
<p><span style="font-weight: bold">Population:</span> ${item.population}</p>
<p><span style="font-weight: bold">Languages:</span> ${Object.values(
        item.languages
      )}</p>`
    )
  );
}

input.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value.trim() !== '') {
      const country = event.target.value.trim();
      getCountries(country);
    }
    div.innerHTML = '';
    ul.innerHTML = '';
  }, DEBOUNCE_DELAY)
);

ul.addEventListener('click', list);

function list(event) {
  getCountries((input.value = event.target.innerText.trim()));
}
