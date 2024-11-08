/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:3000/api/v1/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/v1/users/logout");
    console.log(res);
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert("error", "Error logging out! Try again.");
  }
};
