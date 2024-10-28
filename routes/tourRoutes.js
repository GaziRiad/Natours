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

const { createReview } = require("../controllers/reviewController");

const router = express.Router();

// 3) ROUTES

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthPlan);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// Reviews
router
  .route("/:tourId/reviews")
  .get()
  .post(protect, restrictTo("user"), createReview);

module.exports = router;
