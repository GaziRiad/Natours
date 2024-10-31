// const AppError = require("../lib/utils/appError");
// const catchAsync = require("../lib/utils/catchAsync");
const Review = require("../models/reviewModel");

const factory = require("./handlerFactory");

const setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const getAllReviews = factory.getAll(Review);
const getReview = factory.getOne(Review);
const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
  getAllReviews,
  setTourAndUserIds,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
