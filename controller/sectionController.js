const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../model/blogModel");
const Section = require("../model/sectionModel");
const multer = require("multer");
const sharp = require("sharp");

exports.getAllBlogSections = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.find({ _id: blogId }).populate("sections");
  if (!blog) return next(new AppError("there is no blog with this id", 404));

  res.status(200).json({
    status: "success",
    data: {
      sections: blog.map((blog) => blog.sections),
    },
  });
});

exports.getOneBlogSection = catchAsync(async (req, res, next) => {
  const { sectionId } = req.params;
  const section = await Section.findById(sectionId);
  if (!section)
    return next(new AppError("there is no blog section with this id", 404));
  res.status(200).json({
    status: "success",
    data: {
      section,
    },
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("only image allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single("image");

exports.resizeSectionPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `sections-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/sections/${req.file.filename}`);
  next();
});

exports.createBlogSection = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  if (req.file) {
    req.body.image = req.file.filename;
  }
  const newBlogSection = await Section.create({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    blog: blogId,
  });
  res.status(200).json({
    status: "success",
    data: {
      newBlogSection,
    },
  });
});

exports.updateSection = catchAsync(async (req, res, next) => {
  const { sectionId } = req.params;
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);

  if (req.user._id !== blog.author._id && req.user.role !== "admin") {
    return next(new AppError("you are not allowed to update this blog", 401));
  }

  if (req.file) {
    req.body.image = req.file.filename;
  }
  const section = await Section.findOneAndUpdate({ _id: sectionId }, req.body, {
    new: true,
    runValidators: false,
  });
  if (!section)
    return next(new AppError("there is no blog section with this id", 404));

  res.status(200).json({
    status: "success",
    data: {
      section,
    },
  });
});

exports.deleteSection = catchAsync(async (req, res, next) => {
  const { sectionId } = req.params;
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (req.user._id !== blog.author._id && req.user.role !== "admin") {
    return next(new AppError("you are not allowed to delete this blog", 401));
  }
  const section = await Section.findOneAndRemove({ _id: sectionId });
  if (!section)
    return next(new AppError("there is no blog section with this id", 404));
  res.status(204).json({
    status: "success",
  });
});
