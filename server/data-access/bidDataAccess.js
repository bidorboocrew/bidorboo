//handle all user data manipulations
const mongoose = require('mongoose');
const moment = require('moment');

const User = mongoose.model('UserModel');
const utils = require('../utils/utilities');

exports.findOneByemail = email => User.findOne({ email: email });

exports.findOneByUserId = id => User.findOne({ userId: id });
exports.createNewUser = userDetails =>
  new User({
    ...userDetails,
    globalRating: 0,
    membershipStatus: 'NEW_MEMBER'
  }).save();

exports.findOneByUserIdAndUpdate = (
  id,
  data,
  options = {
    new: true,
    lean: true //do not return the object with all mongodb additional magic funcs
  },
  callback
) =>
  User.findOneAndUpdate(
    { userId: id },
    { $set: { ...data } },
    options,
    callback
  );

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
