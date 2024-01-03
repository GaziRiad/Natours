const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);

const checkId = (req, res, next, val) => {
  if (val >= tours.length)
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });

  next();
};

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

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

  res
    .status(200)
    .json({ status: "success", data: { tour: "<Updated tour here...>" } });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  res.status(204).json({ status: "", data: null });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
};

///////////////////////////////////////////////
