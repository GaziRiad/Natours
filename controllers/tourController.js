const APIFeatures = require("../lib/utils/apifeatures");
const Tour = require("../models/tourModel");

// 2) ROUTE HANDLERS

const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query);
    const tours = await features.filter().sort().limitFields().paginate().query;

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

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          totalTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { totalTours: -1 } },
      // { $match: { _id: { $ne: "EASY" } } },
    ]);

    res.status(200).json({ status: "success", data: { stats } });
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
  aliasTopTours,
  getTourStats,
};
