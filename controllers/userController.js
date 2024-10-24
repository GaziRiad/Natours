const AppError = require("../lib/utils/appError");
const catchAsync = require("../lib/utils/catchAsync");
const User = require("../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

//
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user Posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("This route is not for password updates. ", 400));

  // 2) Filtered out unwanted field names that are not allowed to be uploaded
  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: { user: updatedUser } });
});

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "Error", message: "This route is not yet defined" });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
};
