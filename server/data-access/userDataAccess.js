//handle all user data manipulations

const mongoose = require('mongoose');
const User = mongoose.model('users');

exports.getUserById = (passport,id) => User.findById(id);

exports.getOneUserWithId = (id) => User.findOne({ Id: id });
exports.createNewUser = (userDetails) => {
  new User({
    Id: userDetails.id,
    name: userDetails.displayName,
    provider: userDetails.provider
  })
    .save()
    .then(user => {
      done(null, user);
    });
};

