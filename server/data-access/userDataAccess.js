//handle all user data manipulations
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const utils = require('../utils/utilities');

exports.findOneByemail = email => User.findOne({ email: email });

exports.findOneByUserId = id => User.findOne({ userId: id });
exports.createNewUser = userDetails =>
  new User({
    ...userDetails,
    globalRating: 0,
    membershipStatus: 'NEW_MEMBER',
    lastSeenOnline: new Date(moment.utc().format())
  }).save();

exports.registerNewUserWithPassword = userDetails => {
  const encryptedPassword = utils.encryptData(userDetails.password);
  userDetails.password = encryptedPassword;
  return new User({
    ...userDetails,
    globalRating: 0,
    membershipStatus: 'NEW_MEMBER',
    lastSeenOnline: new Date(moment.utc().format())
  }).save();
};

exports.checkUserPassword = (candidatePass, encryptedPass) => {
  const isTheRightPassword = utils.compareEncryptedWithClearData(candidatePass, encryptedPass)
  return isTheRightPassword;
};
