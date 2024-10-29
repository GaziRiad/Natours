const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const Review = require("../models/reviewModel");

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter;

  if (req.params.tourId) filter = { tour: req.params?.tourId } || {};

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create({
    ...req.body,
    tour: tourId,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

module.exports = { getAllReviews, createReview };
