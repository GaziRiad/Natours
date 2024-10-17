const jwt = require("jsonwebtoken");
const catchAsync = require("../lib/utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../lib/utils/appError");

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signinToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: { user: { name: newUser.name, email: newUser.email } },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password"); //because password is set to select false in the schema

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid credentials", 401)); //UNAUTHRIZED

  // 3) If everything okay, send token to client
  const token = signinToken(user._id);
  res.status(200).json({ status: "success", token });
});

module.exports = { signup, login };
