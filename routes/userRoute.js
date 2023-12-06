const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getOneUser,
} = require("../controller/userController");
const {
  register,
  logOut,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controller/authController");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(logOut);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-password").post(protect, updatePassword);
router
  .route("/")
  .get(protect, getAllUsers)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);
router.route("/:id").get(protect, getOneUser).patch(protect, updateUser);

module.exports = router;
