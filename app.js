const fs = require("fs");
const express = require("express");

const app = express();

// MIDDLEWARE
app.use(express.json());

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

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length)
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  // console.log(req.body);
  const newTour = { id: tours.at(-1).id + 1, ...req.body };
  console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.log(err);
      // 201 stands for CREATED
      res.status(201).json({ status: "success", data: { tour: newTour } });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
