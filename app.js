const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./lib/utils/appError");

const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 60 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Test middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);

//   next();
// });

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

//Unamtched routes
app.all("*", (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(err);
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
