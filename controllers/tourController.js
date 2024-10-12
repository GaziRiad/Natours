const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);

const checkId = (req, res, next, val) => {
  if (Number(val) > tours.length) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing name or price" });
  }

  next();
};

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: "success", data: { tours }, results: tours.length });
};

const getTour = (req, res) => {
  let { id } = req.params;
  id = Number(id);

  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({ status: "success", data: { tour } });
};

const createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res
          .status(500)
          .send({ status: "error", message: "Error writing file" });
      }

      res.status(201).send({ status: "success", data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  let { id } = req.params;
  id = Number(id);

  const tour = tours.find((tour) => tour.id === id);

  const updatedTour = { ...tour, ...req.body };
  res.status(200).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  let { id } = req.params;
  id = Number(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};
