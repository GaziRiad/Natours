const Tour = require("../models/tourModel");

// 2) ROUTE HANDLERS
const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1. Advanced Filtering: Use regex for partial matches (optional)
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    queryStr = JSON.parse(queryStr);
    console.log(queryStr);
    const query = Tour.find(queryStr);

    const tours = await query;
    res
      .status(200)
      .json({ status: "success", results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).send({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
};

const createTour = async (req, res) => {
  try {
    // const newTour = new Tour(req.body);
    // newTour.save()

    const newTour = await Tour.create({ ...req.body });

    res.status(201).json({ status: "success", data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: "error", message: "Invalid data sent!" });
    console.log(err.message);
  }
};

const updateTour = async (req, res) => {
  try {
    console.log(req.body);

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({ status: "success", data: null });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
