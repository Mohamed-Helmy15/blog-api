const express = require("express");
const {
  createBlogSection,
  getAllBlogSections,
  getOneBlogSection,
  updateSection,
  deleteSection,
  uploadImage,
  resizeSectionPhoto,
} = require("../controller/sectionController");
const { protect, authorize } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getAllBlogSections)
  .post(
    protect,
    authorize("admin", "employer"),
    uploadImage,
    resizeSectionPhoto,
    createBlogSection
  );

router
  .route("/:sectionId")
  .get(protect, getOneBlogSection)
  .patch(
    protect,
    authorize("admin", "employer"),
    uploadImage,
    resizeSectionPhoto,
    updateSection
  )
  .delete(protect, deleteSection);
module.exports = router;
