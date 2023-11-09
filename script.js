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

const getCountryLocation = async function (country) {
  try {
    /////////////////////////////////////[Getting country name through API]
    const countryAPIRequest = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    if (!countryAPIRequest.ok) throw new Error("Country not found");
    const [countryAPIFetched] = await countryAPIRequest.json();
    renderCountry(countryAPIFetched);

    /////////////////////////////////////[Getting neighbour country]
    const neighbouringCountry = countryAPIFetched.borders?.[0];
    if (!neighbouringCountry)
      throw new Error("This country doesn't have any neighbour");
    const neighbour = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighbouringCountry}`
    );
    const [neighbourData] = await neighbour.json();
    renderCountry(neighbourData, "neighbour");
  } catch (error) {
    showingError(error.message);
  }
};

const whereAMI = async function (latitude, longtitude) {
  try {
    const coordinateAPIRequest = await fetch(
      `https://geocode.xyz/${latitude},${longtitude}?geoit=json`
    );
    if (!coordinateAPIRequest.ok)
      throw new Error("latitude or longitude not found");
    const coordinateData = await coordinateAPIRequest.json();
    const { country } = coordinateData;
    if (!country)
      throw new Error("Please try reloading the page a few more seconds");
    getCountryLocation(country);
  } catch (error) {
    showingError(error.message);
  }
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

whereAmIBtn.addEventListener("click", async function () {
  try {
    errorContainer.innerHTML = "";
    countriesContainer.innerHTML = "";
    const currentPosition = await getPosition();
    console.log(currentPosition);
    const { latitude, longitude } = currentPosition.coords;
    whereAMI(latitude, longitude);
    console.log(latitude, longitude);
  } catch (error) {
    showingError(error.message);
  }
});
