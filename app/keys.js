// API-ключи
const OPENWEATHER = "08921998095a538cc8c7bd56e350dfef"; // OpenWeatherMap
const GEOIPIFY = "at_shYjk5pzobvCPVthoXt0OuhfE5gFd"; // IP Geolocation API
const OPENWEATHER_URL_ONE = `https://api.openweathermap.org/data/2.5/weather?&appid=${OPENWEATHER}&units=metric&lang=ru&q=`;
const GEOIPIFY_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${GEOIPIFY}`;

export {OPENWEATHER,OPENWEATHER_URL_ONE, GEOIPIFY_URL}