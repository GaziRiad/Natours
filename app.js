const fs = require("fs");
const express = require("express");

const app = express();

// app.get("/", (req, res) => {
//   res.status(200);
//   // res.send("Hello from the server side!");
//   res.json({ message: "Hello from the server side!", app: "Natours 1.0.0" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post to this endpoint...");
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

app.get("/api/v1/tours", (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
