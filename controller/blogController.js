const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../model/blogModel");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    status: "success",
    length: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getOneBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate({
    path: "sections",
    select: "title image description",
  });
  if (!blog) return next(new AppError("there is no blog with this id", 404));

  if (blog.is_paid === true && req.user.role === "user") {
    if (!req.user.freeBlogs.includes(id)) {
      return next(new AppError("this blog is not for free", 401));
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  const author = req.user._id;
  const newBlog = await Blog.create({ ...req.body, author });
  res.status(200).json({
    status: "success",
    data: {
      newBlog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("there is no blog with this id", 404));

  if (req.user._id !== blog.author._id && req.user.role !== "admin") {
    return next(new AppError("you are not allowed to delete this blog", 401));
  }
  const newBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      newBlog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("there is no blog with this id", 404));

  if (req.user._id !== blog.author._id && req.user.role !== "admin") {
    return next(new AppError("you are not allowed to delete this blog", 401));
  }
  await Blog.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
  });
});
