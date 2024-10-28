const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const Review = require("../models/reviewModel");

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) next(new AppError("No review found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: { review },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  console.log(review);

  if (
    req.user.role === "admin" ||
    String(req.user._id) === String(review.user._id)
  ) {
    await Review.findByIdAndDelete(id);
    console.log("DELETED!");
  }

  res.status(204).json({ status: "success", data: null });
});

module.exports = { getAllReviews, getReview, createReview, deleteReview };
