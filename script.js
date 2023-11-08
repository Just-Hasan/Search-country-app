"use strict";

const btn = document.querySelector(".btn-country");
const searchCountryNameBtn = document.getElementById("btn-search-input-field");
const searchCountryCoordinateBtn = document.getElementById(
  "btn-search-lat-long"
);
const whereAmIBtn = document.getElementById("btn-where-am-i");

const countriesContainer = document.querySelector(".countries");
const inputFieldContainer = document.querySelector(".input-container");

// Different input field
const inputField = document.querySelector(".search-input-field");
const inputLatitude = document.querySelector(".search-latitude");
const inputLongtitude = document.querySelector(".search-longtitude");

// Switch search style button
const searchCountry = document.getElementById("btn-switch-search");
const searchCoordinate = document.getElementById("btn-switch-coordinate");

// Different search container
const searchCountryContainer = document.querySelector(".input-search-country");
const coordinateCountryContainer = document.querySelector(
  ".input-coordinate-country"
);
const errorContainer = document.querySelector(".error-container");

// Container for coding challenge 2
const codingChallenge2Container = document.querySelector(".coding-challenge-2");

/*
/////////////////////////////////////[Asynchronous JavaScript Coding Challenge - 1]
PART 1 :

1. Create a function 'whereAmI' which takes as inputs
a latitude value (lat) and a longitude value (lng)
(these are GPS coordinates, examples are below)

2. Do 'reverse geocoding' of the provided coordinates.
Reverse geocoding means to convert coordinates to
a meaningful location, like a city and country name.
Use this API to do reverse geocoding:
https://geocoding.xyz.api
The AJAX call will be done to URL with this format:
https://geocode.xyz/52.508,13.381?geoit=json

3. Once you have the data, take a look at it in the console
to see all the attributes that you received about the
provided location. Then, using this data,
log a message like this to the console:
'You are in Berlin, Germany'

4. Chain a 'catch' method to the end of the promise
chain and log errors to the console

5. This API allows you to make only 4 request per
second. If you reload fast, you will get this error with code 403.
This is an error with the request. Remember, fetch()
does not reject the promise in this case. So create an error to reject 
the promise yourself, with a meaningful error message

PART 2 : 

6. Now it's time to use the received data to render a
country. So take the relevant attribute from the geocoding API
result, and plug it into the countries API that we have been using.

7. Render the country and catch any errors, just like
we have done in the last lecture

(Latitude, Longtitude)
TEST COORDINATES 1: 52.508, 13.381
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 3: -33.933, 18.474

*/

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        resolve(success);
      },
      (error) => {
        reject(new Error("Please enable location"));
      }
    );
  });
};

const showingError = function (errorMsg) {
  const error = document.createElement("h2");
  error.classList.add("error-message");
  error.innerText = `${errorMsg}`;
  errorContainer.style.marginBottom = "24px";
  errorContainer.appendChild(error);
};

const renderCountry = function (countryObject, className = "") {
  const currency = Object.keys(countryObject.currencies)[0];
  const mainLanguage = Object.keys(countryObject.languages)[0];

  const population = (+countryObject.population / 1000000).toFixed(2);
  console.log(countryObject);
  console.log(mainLanguage);
  /////////////////////////////////////
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${countryObject.flags.svg}" alt="${
    countryObject.flags.alt
  }"/>
  <div class="country__data">
    <h3 class="country__name">${countryObject.name.common}</h3>
    <h4 class="country__region">${countryObject.region}</h4>
    <p class="country__row"><span>🏙️</span>${countryObject.capital}</p>
    <p class="country__row"><span>👫</span>${population} ${
    String(countryObject.population).length >= 6 ? "Millions" : "Thousands"
  }</p>
    <p class="country__row"><span>🗣️</span>${
      countryObject.languages[`${mainLanguage}`]
    }</p>
    <p class="country__row"><span>💰</span>${
      countryObject.currencies[`${currency}`].name
    }</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML("afterbegin", html);
};

/*
1. First we create getCountryLocation function which receives 1 paramater which is the country
2. Fetch the api (return fetch(`https://restcountries.com/v3.1/name/${country}`) Do an error handling after that
3. After receiving its actual data from response, then get the first index of the array which is its actual data
4. Use the render country function on the country data we receive
5. ON the country data, get the neighbouring country, if it doesn't have any throw an error
6. Get the neighbour using the previous data, and use it on this api (`https://restcountries.com/v3.1/alpha/${neighbourCountry}')
7. get the actual data from the api, and then render the data using renderCOuntry functioin. Remember that this function receieves
   object
*/
const getCountryLocation = function (country) {
  return fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => {
      if (!response.ok) throw new Error("Country not found😅");
      return response.json();
    })
    .then((data) => {
      const [countryData] = data;
      renderCountry(countryData);
      const neighbourCountry = countryData.borders?.[0];
      if (!neighbourCountry)
        throw new Error("This country doesn't have any neighbour");
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbourCountry}`);
    })
    .then((neighbourResponse) => neighbourResponse.json())
    .then((neighbourData) => {
      const [data] = neighbourData;
      renderCountry(data, "neighbour");
    })
    .catch((error) => {
      showingError(error.message);
      console.log(error);
    });
};

const whereAMI = function (latitude, longtitude) {
  fetch(`https://geocode.xyz/${latitude},${longtitude}?geoit=json`)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((geolocationData) => {
      if (geolocationData.country === undefined)
        throw new Error("Please reload the page in a few seconds");
      const country = geolocationData.country.toLowerCase();
      const region = geolocationData.region;
      getCountryLocation(country);
    })
    .catch((error) => {
      showingError(error.message);
    });
};

searchCountry.addEventListener("click", function () {
  searchCountryContainer.classList.toggle("hidden");
  coordinateCountryContainer.classList.toggle("hidden");
});

searchCoordinate.addEventListener("click", function () {
  searchCountryContainer.classList.toggle("hidden");
  coordinateCountryContainer.classList.toggle("hidden");
});

const searchCountryCoordinateFnc = function () {
  countriesContainer.innerHTML = "";
  let latitudeValue = inputLatitude.value;
  let longtitudeValue = inputLongtitude.value;
  whereAMI(latitudeValue, longtitudeValue);
};

const searchCountryNameFnc = function () {
  countriesContainer.innerHTML = "";
  const countryName = inputField.value;
  getCountryLocation(countryName);
};

searchCountryCoordinateBtn.addEventListener("click", function () {
  errorContainer.innerHTML = "";
  searchCountryCoordinateFnc();
});

searchCountryNameBtn.addEventListener("click", function () {
  errorContainer.innerHTML = "";
  searchCountryNameFnc();
});

document.addEventListener("keydown", function (e) {
  errorContainer.innerHTML = "";
  const pressKey = e.key;
  if (pressKey !== "Enter") return;

  if (searchCountryContainer.classList.contains("hidden")) {
    searchCountryCoordinateFnc();
  } else {
    searchCountryNameFnc();
    console.log("The search is name");
  }
});

whereAmIBtn.addEventListener("click", function () {
  errorContainer.innerHTML = "";
  countriesContainer.innerHTML = "";
  getPosition()
    .then((position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
    })
    .then((response) => {
      return response.json();
    })
    .then((geolocationData) => {
      console.log(geolocationData);
      if (geolocationData.country === undefined)
        throw new Error("Please reload the page in a few seconds");
      const country = geolocationData.country.toLowerCase();
      const region = geolocationData.region;
      getCountryLocation(country);
    })
    .catch((error) => showingError(error.message));
});
