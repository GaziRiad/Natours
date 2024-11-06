const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
} = require("../controllers/viewsController");
const { isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getOverview);
router.get("/tours/:tourSlug", getTour);
router.get("/login", getLoginForm);

module.exports = router;
