const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../lib/utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../lib/utils/appError");

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
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

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError("Authentication required", 401));

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );

  // 4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password. Please log in again.", 401),
    );

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
module.exports = { signup, login, protect };
