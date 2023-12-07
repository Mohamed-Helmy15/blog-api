const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "author is required"],
    },
    // content: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Section",
    //   },
    // ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual("sections", {
  ref: "Section",
  foreignField: "blog",
  localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
  this.populate({ path: "author", select: "firstName lastName email" });
  // this.populate({ path: "content" });
  next();
});
blogSchema.pre("save", function (next) {
  if (this.is_paid === true && !this.price) {
    return next(new AppError("price is required", 400));
  } else if (this.is_paid === false && this.price) {
    return next(new AppError("this is a free blog", 400));
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
