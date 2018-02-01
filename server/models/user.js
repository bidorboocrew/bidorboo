const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  Id: String,
  name: String,
  provider: String,
  imageUrl: String
});

mongoose.model('users', userSchema);
