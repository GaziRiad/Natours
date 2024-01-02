const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// 1) MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id >= tours.length)
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });
  res
    .status(200)
    .json({ status: "success", data: { tour: "<Updated tour here...>" } });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id >= tours.length)
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });

  res.status(204).json({ status: "", data: null });
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not yet defined!" });
};
const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not yet defined!" });
};
const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not yet defined!" });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not yet defined!" });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not yet defined!" });
};

// 3) ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// 4) START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
