const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { signup, login, protect } = require("../controllers/authController");

const router = express.Router();

// 3) ROUTES
router.post("/signup", signup);
router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
