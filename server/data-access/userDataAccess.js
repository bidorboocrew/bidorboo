//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');



exports.findSessionUserById = (id) =>
  User.findOne({ userId: id }, { userId: 1, _id: 1 })
    .lean(true)
    .exec();

exports.findOneByUserId = (userId) =>
  User.findOne({ userId })
    .lean(true)
    .exec();

exports.createNewUser = async (userDetails) =>
  await new User({
    ...userDetails,
  }).save();

exports.updateUserProfilePic = (userId, imgUrl, imgPublicId) =>
  User.findOneAndUpdate(
    { userId },
    {
      $set: {
        profileImage: {
          url: imgUrl,
          public_id: imgPublicId,
        },
      },
    },
    {
      new: true,
    }
  )
    .lean(true)
    .exec();

exports.updateUserProfileDetails = (userId, userDetails) =>
  User.findOneAndUpdate(
    { userId },
    {
      $set: { ...userDetails },
    },
    {
      new: true,
    }
  )
    .lean(true)
    .exec();
