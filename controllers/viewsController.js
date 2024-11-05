const catchAsync = require("../lib/utils/catchAsync");
const Review = require("../models/reviewModel");
const Tour = require("../models/tourModel");

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const { tourSlug } = req.params;
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: tourSlug }).populate({
    path: "reviews",
    select: "review rating user",
  });

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

module.exports = { getOverview, getTour, getLoginForm };
