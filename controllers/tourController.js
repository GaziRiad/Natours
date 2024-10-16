const APIFeatures = require("../lib/utils/apifeatures");
const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const Tour = require("../models/tourModel");

// 2) ROUTE HANDLERS

const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query);
  const tours = await features.filter().sort().limitFields().paginate().query;

  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  console.log(process.env.NODE_ENV);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).send({
    status: "success",
    data: {
      tour,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create({ ...req.body });

  res.status(201).json({ status: "success", data: { tour: newTour } });
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { returnDocument: "after", runValidators: true },
  );

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({ status: "success", data: { tour } });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).send({ status: "success", data: null });
});

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
        _id: { $month: "$startDates" },
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

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthPlan,
};
