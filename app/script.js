const OPENWEATHER = "08921998095a538cc8c7bd56e350dfef";
const OPENWEATHER_URL_ONE = `https://api.openweathermap.org/data/2.5/weather?&appid=${OPENWEATHER}&units=metric&lang=ru&q=`;
const GEOIPIFY_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_shYjk5pzobvCPVthoXt0OuhfE5gFd`;

const geolocation = document.querySelector(".geolocation"); // Раздел, отображающий погоду
const temperature = document.querySelector(".geolocation__temperature"); // Температура
const city = document.querySelector(".geolocation__city"); // Название города
const description = document.querySelector(".geolocation__description"); // Описание погоды
const change = document.querySelector("#change"); // Кнопка для смены города
const selection = document.querySelector(".selection"); // Раздел с поиском интересующего города
const input = document.querySelector("#input"); // Ввод интересующего города
const find = document.querySelector("#find"); // Кнопка для поиска введенного города
const form = document.querySelector("#form"); // Форма ввода интересующего города
const error = document.querySelector(".error"); // Раздел с ообщением об ошибке
const again = document.querySelector("#again"); // Кнопка для возврашения к разделу ввода интересующего города
const loader = document.querySelector(".lds-ring"); // Колесо загрузки

// Запрос на определение местоположения
function locationRequest() {
  return new Promise((resolve, reject)=>{
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Функция для получения данных геолокации при доступе к данным о местоположении, либо по IP адресу при блокировке доступа
async function findGeolocation() {
  try {
    const userGeolocation = await locationRequest();
    return await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${userGeolocation.coords.latitude}&lon=${userGeolocation.coords.longitude}&appid=${OPENWEATHER}&units=metric&lang=ru`
    ).then((response) => response.json());
  } catch (error) {
    console.error(error.message);
    return await checkCityWithIP();
  }
}

// Функция, отображающая температуру введеного города
async function searchWeather(city) {
  return await fetch(OPENWEATHER_URL_ONE + city).then((response) =>
    response.json()
  );
}

// Функция, отображающая погоду по IP адресу и при блокировке доступа к данным о местоположении
async function checkCityWithIP() {
  try {
    const searcher = await fetch(GEOIPIFY_URL).then((response) =>
      response.json()
    );
    return await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${searcher.location.lat}&lon=${searcher.location.lng}&appid=${OPENWEATHER}&units=metric&lang=ru`
    ).then((response) => response.json());
  } catch (error) {
    console.error(
      "API для определения геолокации пользователя по IP не работает.", error
    );
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
  } catch {
    showSelection();
  }
}
loadFirstPage();

change.addEventListener("click", showSelection); // Событие кнопки по смене города

form.addEventListener("submit", (event) => {
  event.preventDefault();
  findWeather();
}); // Событие отправления формы по нажатию на Enter

find.addEventListener("click", findWeather); // Событие кнопки для поиска введеного города

again.addEventListener("click", showSelection); // Событие кнопки для возврашения к разделу ввода интересующего город

// Функция по поиску введеного города
async function findWeather() {
  const city = input.value.trim();
  try {
    const weatherByCity = await searchWeather(city);
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