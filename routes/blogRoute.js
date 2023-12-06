const express = require("express");
const {
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getOneBlog,
  createBlog,
} = require("../controller/blogController");
const sectionRoute = require("./sectionRoute");
const { protect, authorize } = require("../controller/authController");

const router = express.Router();

router.use("/:blogId/sections", sectionRoute);

router
  .route("/")
  .get(protect, getAllBlogs)
  .post(protect, authorize("admin", "employer"), createBlog);
router
  .route("/:id")
  .get(protect, getOneBlog)
  .patch(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
