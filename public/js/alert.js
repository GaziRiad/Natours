/* eslint-disable */

export const hidingAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

// type is "sucess" or "error"
export const showAlert = (type, msg) => {
  hidingAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  window.setTimeout(hidingAlert, 5000);
};
