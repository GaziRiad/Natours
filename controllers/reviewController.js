const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const Review = require("../models/reviewModel");

const factory = require("./handlerFactory");

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

const setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
  getAllReviews,
  createReview,
  setTourAndUserIds,
  updateReview,
  deleteReview,
};
