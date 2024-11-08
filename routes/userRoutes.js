const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/userController");

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// 3) ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch("/updateMyPassword", updatePassword);

router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
