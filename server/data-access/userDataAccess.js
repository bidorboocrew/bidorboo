//handle all user data manipulations

const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
var moment = require('moment');

exports.findOneByUserId = id => User.findOne({ userId: id });
exports.createNewUser = userDetails =>
  new User({
    ...userDetails,
    globalRating: 0,
    membershipStatus: 'newMember',
    lastSeenOnline: new Date(moment.utc().format())
  }).save();
