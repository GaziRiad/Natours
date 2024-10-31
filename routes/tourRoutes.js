const express = require("express");

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthPlan,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// 3) ROUTES

router.use("/:tourId/reviews", reviewRouter);

router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthPlan);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
