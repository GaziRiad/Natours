const catchAsync = require("../lib/utils/catchAsync");
const User = require("../models/userModel");

const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({ ...req.body });

  res.status(201).json({ status: "success", data: { user: newUser } });
});

module.exports = { signup };
