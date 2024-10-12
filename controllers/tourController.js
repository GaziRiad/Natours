const Tour = require("../models/tourModel");

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing name or price" });
  }

  next();
};

// 2) ROUTE HANDLERS
const getAllTours = async (req, res) => {
  const tours = await Tour.find();
  res
    .status(200)
    .json({ status: "success", data: { tours }, results: tours.length });
};

const getTour = (req, res) => {
  res.status(500).send({ status: "error", message: "Error writing file" });
};

const createTour = (req, res) => {
  res.status(500).send({ status: "error", message: "Error writing file" });
};

const updateTour = (req, res) => {
  res.status(500).send({ status: "error", message: "Error writing file" });
};

const deleteTour = (req, res) => {
  res.status(500).send({ status: "error", message: "Error writing file" });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
};
