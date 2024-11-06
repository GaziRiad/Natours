/* eslint-disable */

const login = async (email, password) => {
  try {
    console.log(email, password);
    const res = await axios.post("http://localhost:3000/api/v1/users/login", {
      email,
      password,
    });

    console.log(res);
  } catch (err) {
    console.log(err.response.data.message);
  }
};

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  login(email, password);
});
