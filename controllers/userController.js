const APIFeatures = require("../lib/utils/apifeatures");
const catchAsync = require("../lib/utils/catchAsync");
const User = require("../models/userModel");

// 2) ROUTE HANDLERS
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
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
};
