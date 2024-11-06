/* eslint-disable */

const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:3000/api/v1/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      alert("Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  login(email, password);
});
