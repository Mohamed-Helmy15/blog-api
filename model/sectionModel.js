const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sectionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "Blog",
    select: "title",
  });
  next();
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
