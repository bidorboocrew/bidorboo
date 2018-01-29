const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  Id: String,
  name: String
});

mongoose.model('users', userSchema);
