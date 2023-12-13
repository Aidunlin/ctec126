// weather.js
// Created by: Bruce Elgort / Spring 2023
// Student: Aidan Linerud

/** OpenWeatherMap (OWM) api key. */
const API_KEY = "e9956d33c243c868a9d668fa53cef699";
/** A reference to the text displayed underneath the main heading. */
const cityText = document.getElementById("city-text");
/** A reference to the zip code input. */
const zipCodeInput = document.getElementById("zip-input");
/** A reference to the button used to get weather for a zip code. */
const getWeatherButton = document.getElementById("get-weather-button");
/** A reference to the div that contains all weather information. */
const weatherDisplay = document.getElementById("weather-display");

/**
 * Checks if the OWM api responded with an error, updating `cityText` if so.
 * @param {string} cod Internal parameter returned from api response.
 */
function apiErrorOccurred(cod) {
  if (cod == "400" || cod == "404" || cod == "401") {
    cityText.innerHTML = "Bad zip code!";
    return true;
  }
  return false;
}

/**
 * Converts a zip code to latitude/longitude coordinates using the OWM api.
 * @param {string} zip The zip code.
 */
async function convertZipToCoords(zip) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (apiErrorOccurred(data.cod)) return;

  localStorage.setItem("zip", zipCodeInput.value);
  return { lat: data.lat, lon: data.lon };
}

/**
 * Gets current weather data from OWM.
 * @param {{ lat: number, lon: number }} coords Geographical coordinates.
 */
async function getCurrent(coords) {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(url);
  const data = await response.json();

  if (apiErrorOccurred(data.cod)) return;

  localStorage.setItem("current", JSON.stringify(data));
  return data;
}

/**
 * Gets 5 day forecast data from OWM in 3 hour steps.
 * @param {{ lat: number, lon: number }} coords Geographical coordinates.
 */
async function getForecast(coords) {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(url);
  const data = await response.json();

  if (apiErrorOccurred(data.cod)) return;

  localStorage.setItem("forecast", JSON.stringify(data));
  return data;
}

/**
 * Displays current weather data.
 * @param {*} data Current weather data.
 */
function displayCurrent(data) {
  cityText.innerText = data.name;

  const section = document.createElement("section");
  section.open = true;

  const heading = document.createElement("h2");
  heading.classList.add("day-heading");
  heading.innerText = "Now";

  section.append(heading, createIntervalDisplay(data));
  weatherDisplay.append(section);
}

/**
 * Displays forecast data.
 * @param {*} data Forecast data.
 */
function displayForecast(data) {
  // Re-organize forecast data per day.

  let dataPerDay = [];
  data.list.forEach(intervalData => {
    const date = new Date(intervalData.dt * 1000);

    let existingData = dataPerDay.find(data => areSameDay(data.date, date));
    if (!existingData) {
      existingData = {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        intervals: [],
      };
      dataPerDay.push(existingData);
    }

    existingData.intervals.push(intervalData);
  });

  // Because data was organized per day beforehand,
  // it's much easier to display it separated per day.

  dataPerDay.forEach(dayData => {
    const section = document.createElement("section");

    const heading = document.createElement("h2");
    heading.classList.add("day-heading");
    const dateStr = dayData.date.toLocaleDateString("en-us", { month: "long", day: "numeric", weekday: "long" });
    heading.append(dateStr);
    section.append(heading);

    dayData.intervals.forEach(intervalData => section.append(createIntervalDisplay(intervalData)));

    weatherDisplay.append(section);
  });
}

/**
 * Creates and returns a display for a single interval of weather data.
 * Used for displaying both current and forecast weather.
 * @param {*} data Current weather data or data for a single interval.
 */
function createIntervalDisplay(data) {
  const display = document.createElement("div");
  display.classList.add("weather-interval");

  const leftDivWrap = document.createElement("div");
  leftDivWrap.classList.add("interval-side", "interval-side-left");

  /** Contains time and temperature. */
  const headingDiv = document.createElement("div");
  headingDiv.classList.add("interval-heading");
  const time = document.createElement("span");
  const date = new Date(data.dt * 1000);
  time.innerText = date.toLocaleTimeString("en-us", { hour: "numeric" }).toLowerCase();
  const temp = document.createElement("span");
  temp.innerText = `${Math.round(data.main.temp)}°`;
  headingDiv.append(time, temp);

  /** Contains the icon from OWM. */
  const iconDiv = document.createElement("div");
  iconDiv.classList.add("interval-icon");
  const icon = document.createElement("img");
  icon.width = 100;
  icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.alt = "";
  iconDiv.append(icon);

  /** Contains a short description. */
  const descDiv = document.createElement("div");
  descDiv.classList.add("interval-desc");
  const description = document.createElement("span");
  description.innerText = data.weather[0].description;
  descDiv.append(description);

  leftDivWrap.append(headingDiv, iconDiv, descDiv);

  const rightDivWrap = document.createElement("div");
  rightDivWrap.classList.add("interval-side", "interval-side-right");

  /** Contains temp feels like and temp high/low. */
  const tempDiv = document.createElement("div");
  const feelsLike = document.createElement("span");
  feelsLike.innerText = `feels like ${Math.round(data.main.feels_like)}°`;
  tempDiv.append(feelsLike);
  const tempMin = Math.round(data.main.temp_min);
  const tempMax = Math.round(data.main.temp_max);
  // Only show temp range if there is a difference.
  if (tempMin != tempMax) {
    const rangeTemp = document.createElement("span");
    rangeTemp.innerText = `${tempMax}° high, ${tempMin}° low`;
    tempDiv.append(rangeTemp);
  }

  /** Contains chance of rain and humidity. */
  const rainDiv = document.createElement("div");
  const chanceRain = Math.round(data.pop * 100);
  // Current forecast does not include chance of rain, resulting in "NaN% chance of rain".
  if (!Number.isNaN(chanceRain)) {
    const rain = document.createElement("span");
    rain.innerText = `${Math.round(data.pop * 100)}% chance of rain`;
    rainDiv.append(rain);
  }
  const humidity = document.createElement("span");
  humidity.innerText = `${data.main.humidity}% humidity`;
  rainDiv.append(humidity);

  /** Contains cloud cover and wind. */
  const cloudDiv = document.createElement("div");
  const cloud = document.createElement("span");
  cloud.innerText = `${data.clouds.all}% cloud cover`;
  const wind = document.createElement("span");
  wind.innerText = `${Math.round(data.wind.speed)} mph wind`;
  cloudDiv.append(cloud, wind);

  rightDivWrap.append(tempDiv, rainDiv, cloudDiv);

  display.append(leftDivWrap, rightDivWrap);
  return display;
}

/**
 * Checks if two Date objects represent the same year, month, and day of month.
 * @param {Date} date1 A Date object.
 * @param {Date} date2 A Date object.
 */
function areSameDay(date1, date2) {
  return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}

getWeatherButton.onclick = () => {
  // If API fetches time out, let user try again.
  let timeout = setTimeout(() => {
    cityText.innerHTML = "Please enter a valid zip code";
    zipCodeInput.disabled = false;
    getWeatherButton.disabled = false;
  }, 8000);

  // Disabled until everything from OWM is obtained, or timeout.
  cityText.innerHTML = "Loading...";
  zipCodeInput.disabled = true;
  getWeatherButton.disabled = true;

  convertZipToCoords(zipCodeInput.value)
    .then(coords => {
      // Proceeds when both current and forecast weather data are obtained, or error.
      Promise
        .all([getCurrent(coords), getForecast(coords)])
        .then(([currentData, forecastData]) => {
          // Store last timestamp of successful fetch request.
          localStorage.setItem("lastCache", Date.now());

          weatherDisplay.innerHTML = "";
          displayCurrent(currentData);
          displayForecast(forecastData);
        })
        .catch(console.error)
        .finally(() => {
          // Whether complete or an error occurred (e.g. bad zip code).
          clearTimeout(timeout);
          zipCodeInput.disabled = false;
          getWeatherButton.disabled = false;
        });
    })
    .catch(reason => {
      console.error(reason);
      clearTimeout(timeout);
      zipCodeInput.disabled = false;
      getWeatherButton.disabled = false;
    });
};

zipCodeInput.onkeyup = (e) => {
  if (e.key == "Enter") getWeatherButton.click();
};

window.onload = () => {
  // Gets last used zip code if there is one.
  const zipCode = localStorage.getItem("zip");
  if (zipCode) zipCodeInput.value = zipCode;

  // Determines whether to use previously stored weather data.

  const lastCache = localStorage.getItem("lastCache");
  // Checks if it's been at least 30 minutes since last cache.
  const isCacheStale = Date.now() - lastCache > 30 * 60 * 1000;
  const shouldUpdate = zipCode && lastCache && isCacheStale;

  // Gets previously stored weather data, if it exists.
  const weatherData = JSON.parse(localStorage.getItem("current"));
  const forecastData = JSON.parse(localStorage.getItem("forecast"));

  if (shouldUpdate) {
    // There may be stored data that's stale, so update.
    getWeatherButton.click();
  } else if (weatherData && forecastData) {
    // Otherwise, simply display stored data, saving 3 api calls.
    displayCurrent(weatherData);
    displayForecast(forecastData);
  }
};
