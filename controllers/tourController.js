const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const Tour = require("../models/tourModel");
const factory = require("./handlerFactory");

// 2) ROUTE HANDLERS

const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

const getAllTours = factory.getAll(Tour);

const getTour = factory.getOne(Tour, { path: "reviews" });
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
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
});

const getMonthPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" }, //this $month read as a month so july becomes 7
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    { $project: { _id: 0, month: 1, numTourStart: 1, tours: 1 } },
    { $sort: { numTourStart: -1 } },
    // { $limit: 6 },
  ]);
  res.status(200).json({ status: "success", data: { plan } });
});

const getToursWithin = async (req, res, next) => {
  // "/tours-within/233/center/34.110867,-118.047104/unit/mi"

  const { distance, latlng, unit } = req.params;

  const [lat, long] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !long)
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,long.",
        400,
      ),
    );

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[long, lat], radius],
      },
    },
  });

  res
    .status(200)
    .json({ success: "success", results: tours.length, data: { data: tours } });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthPlan,
  getToursWithin,
};
