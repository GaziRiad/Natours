const AppError = require("../lib/utils/appError");

/* eslint-disable no-unused-vars */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknow error: don't leak details to the client
  } else {
    // 1) Log the error
    console.error("Error 💥", err);

    res.status(err.statusCode).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);

    if (err.name === "ValidationError") {
      console.log("ERROR");
    }

    if (err.code === 11000) {
      // Duplicate key error
      console.log("ERROR");
    }

    sendErrorProd(error, res);
  }
};
