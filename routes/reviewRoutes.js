const express = require("express");
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").get(protect, getReview).delete(protect, deleteReview);

module.exports = router;
