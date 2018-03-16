//handle all user data manipulations
const mongoose = require('mongoose');
const moment = require('moment');
const applicationDataAccess = require('../data-access/applicationDataAccess');
const User = mongoose.model('UserModel');
const utils = require('../utils/utilities');

exports.findOneByUserIdForSession = id =>
  User.findOne({ userId: id }, { userId: 1, _id:1 })
    .lean()
    .exec();

exports.findOneByemail = email =>
  User.findOne(
    { email: email },
    {
      //exclude
      settings: 0,
      extras: 0,
      userRole: 0,
      lockUntil: 0,
      loginAttempts: 0,
      provider: 0,
      paymentRefs: 0,
      _reviews: 0,
      password: 0,
      skills: 0
    }
  )
    .lean()
    .exec();

exports.findOneByUserId = id =>
  User.findOne(
    { userId: id },
    {
      //exclude
      settings: 0,
      extras: 0,
      userRole: 0,
      lockUntil: 0,
      loginAttempts: 0,
      provider: 0,
      paymentRefs: 0,
      _reviews: 0,
      password: 0,
      skills: 0
    }
  )
    .lean()
    .exec();
exports.createNewUser = async userDetails => {
  try {
    const newUser = await new User({
      ...userDetails,
      globalRating: null,
      membershipStatus: 'NEW_MEMBER'
    }).save();
    // await Promise.all([
    //   applicationDataAccess.AppHealthModel.incrementField('totalUsers'),
    //   applicationDataAccess.AppUsersModel.addToUsersList(newUser.id)
    // ]);

    return newUser;
  } catch (e) {
    throw e;
  }
};
exports.findOneByUserIdAndUpdateProfileInfo = (id, data, options) =>
  User.findOneAndUpdate(
    { userId: id },
    {
      $set: { ...data }
    },
    options
  )
    .lean()
    .exec();

exports.findOneByUserIdForPublicRecords = id =>
  User.findOne(
    { userId: id },
    {
      userId: 1,
      _reviews: 1,
      displayName: 1,
      profileImgUrl: 1,
      personalParagraph: 1,
      membershipStatus: 1,
      verified: 1,
      globalRating: 1
    }
  )
    .lean()
    .exec();

// exports.registerNewUserWithPassword = async (userDetails) => {
//   const encryptedPassword = await utils.encryptData(userDetails.password);
//   userDetails.password = encryptedPassword;
//   return new User({
//     ...userDetails,
//     globalRating: 0,
//     membershipStatus: 'NEW_MEMBER',
//   }).save();
// };

// exports.checkUserPassword = async (candidatePass, encryptedPass) => {
//   const isTheRightPassword = await utils.compareEncryptedWithClearData(candidatePass, encryptedPass)
//   return isTheRightPassword;
// };
