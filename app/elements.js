// Раздел, отображающий:
export const geolocation = document.querySelector(".geolocation"); // Геолокацию, определяющий автоматически 
export const temperature = document.querySelector(".geolocation__temperature"); // Температуру
export const city = document.querySelector(".geolocation__city"); // Название города
export const description = document.querySelector(".geolocation__description");
export const img = document.querySelector(".geolocation__img") // Иконку погоды
export const change = document.querySelector("#change"); // Кнопка для смены города
// Раздел, отображающий:
export const selection = document.querySelector(".selection");
export const input = document.querySelector("#input"); // Ввод интересующего города
export const find = document.querySelector("#find"); // Кнопка для поиска введенного города
export const form = document.querySelector("#form") // Форма ввода интересующего города
// Раздел, отображающий:
export const error = document.querySelector(".error") // Сообщение об ошибке
export const again = document.querySelector("#again") // Кнопка для возврашения к разделу ввода интересующего города
export const loader = document.querySelector(".lds-ring"); // Колесо загрузки