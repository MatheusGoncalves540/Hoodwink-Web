const mongoose = require('mongoose');

const User = mongoose.model('User', {
  nickname: String,
  email : String,
  password : String
});

module.exports = User