/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./mapbox.js";
import { login } from "./login.js";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector("form");

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.location);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    login(email, password);
  });
