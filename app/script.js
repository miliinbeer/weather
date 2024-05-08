import { OPENWEATHER, OPENWEATHER_URL_ONE, GEOIPIFY_URL } from "./keys.js";
import * as element from "./elements.js";

// Запрос на определение местоположения
function locationRequest() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}
// Функция для получения данных геолокации при доступе к данным о местоположении, либо по IP адресу при блокировке доступа
async function findGeolocation() {
  try {
    const position = await locationRequest();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const API_URL_OPENWEATHER = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER}&units=metric&lang=ru`;
    const response = await fetch(API_URL_OPENWEATHER);
    const data = await response.json();
    return data;
  } catch (error) {
    return await checkCityWithIP();
  }
}
// Функция, отображающая температуру введеного города
async function checkWeather(city) {
  const response = await fetch(OPENWEATHER_URL_ONE + city);
  const data = await response.json();
  return data;
}
// Функция, отображающая погоду по IP адресу и при блокировке доступа к данным о местоположении
async function checkCityWithIP() {
  try {
    showElements();
    const response = await fetch(GEOIPIFY_URL);
    const data = await response.json();
    const latitude = data.location.lat;
    const longitude = data.location.lng;
    const API_URL_OPENWEATHER = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER}&units=metric&lang=ru`;
    const responseTemperature = await fetch(API_URL_OPENWEATHER);
    const dataTemperature = await responseTemperature.json();
    return dataTemperature;
  } catch (error) {
    console.error("Ooops. Something went wrong.", error);
  }
}
// Функция для отрисовки данных погоды
function renderWeather(data) {
  showGeolocation();
  let weather = data.weather[0].description.split("");
  weather[0] = weather[0].toUpperCase();
  weather = weather.join("");
  element.city.textContent = data.name;
  element.description.textContent = "Сейчас " + weather.toLowerCase();
  element.temperature.textContent = Math.round(data.main.temp) + "°C";
  element.change.textContent = "Выбрать другой город";
}
// Функция, отображающая страницу с загрузкой
async function loadFirstPage() {
  try {
    element.loader.style.display = "block";
    const data = await findGeolocation();
    element.loader.style.display = "none";
    renderWeather(data);
  } catch (error) {
    showSelection();
  }
}
loadFirstPage();
// События
element.change.addEventListener("click", showSelection); // Событие кнопки по смене города
// Событие отправления формы по нажатию на Enter
element.form.addEventListener("submit", (event) => {
  event.preventDefault();
  findWeather();
});
// Событие кнопки для поиска введеного города
element.find.addEventListener("click", findWeather);
// Событие кнопки для возврашения к разделу ввода интересующего город
element.again.addEventListener("click", showSelection);
// Функция по поиску введеного города
async function findWeather() {
  const city = element.input.value.trim();
  try {
    const weatherByCity = await checkWeather(city);
    renderWeather(weatherByCity);
  } catch (error) {
    showError();
  }
}
// Функция, отображающая раздел ошибки
function showError() {
  element.error.style.display = "flex";
  element.geolocation.style.display = "none";
  element.selection.style.display = "none";
}
// Функция, отображающая раздел ввода города
function showSelection() {
  element.geolocation.style.display = "none";
  element.selection.style.display = "flex";
  element.error.style.display = "none";
  element.input.value = "";
}
// Функция, отображающая раздел геолокации
function showGeolocation() {
  element.geolocation.style.display = "block";
  element.selection.style.display = "none";
  element.error.style.display = "none";
}