const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "blogs",
    select: "title is_paid price",
  });
  if (!user) return next(new AppError("there is no user with this id", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const newUser = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: false,
  });
  if (!newUser) return next(new AppError("there is no user with this id", 404));

  res.status(200).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findOneAndRemove({ _id: id });
  if (!user) return next(new AppError("there is no user with this id", 404));
  res.status(204).json({
    status: "success",
  });
});

// exports.getCurrentUserFriends = catchAsync(async (req, res, next) => {
//   const { id } = req.user;
//   const user = await User.findById(id);
//   const friends = await Promise.all(
//     user.friends.map((friend) => User.findById(friend))
//   );
//   if (!friends) return next(new AppError("there some thing error", 404));
//   res.status(200).json({
//     status: "success",
//     data: {
//       friends,
//     },
//   });
// });

// exports.getUserFriends = catchAsync(async (req, res, next) => {
//   const { userId } = req.params;
//   const user = await User.findById(userId);
//   const friends = await Promise.all(
//     user.friends.map((friend) => User.findById(friend))
//   );
//   if (!friends) return next(new AppError("there some thing error", 404));
//   res.status(200).json({
//     status: "success",
//     data: {
//       friends,
//     },
//   });
// });
