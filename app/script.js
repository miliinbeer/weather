import { OPENWEATHER, OPENWEATHER_URL_ONE, GEOIPIFY_URL } from "./keys.js";
// Раздел, отображающий:
export const geolocation = document.querySelector(".geolocation"); // Геолокацию, определяющий автоматически
export const temperature = document.querySelector(".geolocation__temperature"); // Температуру
export const city = document.querySelector(".geolocation__city"); // Название города
export const description = document.querySelector(".geolocation__description");
export const img = document.querySelector(".geolocation__img"); // Иконку погоды
export const change = document.querySelector("#change"); // Кнопка для смены города
// Раздел, отображающий:
export const selection = document.querySelector(".selection");
export const input = document.querySelector("#input"); // Ввод интересующего города
export const find = document.querySelector("#find"); // Кнопка для поиска введенного города
export const form = document.querySelector("#form"); // Форма ввода интересующего города
// Раздел, отображающий:
export const error = document.querySelector(".error"); // Сообщение об ошибке
export const again = document.querySelector("#again"); // Кнопка для возврашения к разделу ввода интересующего города
export const loader = document.querySelector(".lds-ring"); // Колесо загрузки

// Запрос на определение местоположения
function locationRequest() {
  return new Promise(function (resolve, reject) {
    const geolocation = navigator.geolocation.getCurrentPosition(
      resolve,
      reject
    );
    if (geolocation) {
      return;
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
  city.textContent = data.name;
  description.textContent = "Сейчас " + weather.toLowerCase();
  temperature.textContent = Math.round(data.main.temp) + "°C";
  change.textContent = "Выбрать другой город";
}
// Функция, отображающая страницу с загрузкой
async function loadFirstPage() {
  try {
    loader.style.display = "block";
    const data = await findGeolocation();
    loader.style.display = "none";
    renderWeather(data);
  } catch (error) {
    showSelection();
  }
}
loadFirstPage();
// События
change.addEventListener("click", showSelection); // Событие кнопки по смене города
// Событие отправления формы по нажатию на Enter
form.addEventListener("submit", (event) => {
  event.preventDefault();
  findWeather();
});
// Событие кнопки для поиска введеного города
find.addEventListener("click", findWeather);
// Событие кнопки для возврашения к разделу ввода интересующего город
again.addEventListener("click", showSelection);
// Функция по поиску введеного города
async function findWeather() {
  const city = input.value.trim();
  try {
    const weatherByCity = await checkWeather(city);
    renderWeather(weatherByCity);
  } catch (error) {
    showError();
  }
}
// Функция, отображающая раздел ошибки
function showError() {
  error.style.display = "flex";
  geolocation.style.display = "none";
  selection.style.display = "none";
}
// Функция, отображающая раздел ввода города
function showSelection() {
  geolocation.style.display = "none";
  selection.style.display = "flex";
  error.style.display = "none";
  input.value = "";
}
// Функция, отображающая раздел геолокации
function showGeolocation() {
  geolocation.style.display = "block";
  selection.style.display = "none";
  error.style.display = "none";
}