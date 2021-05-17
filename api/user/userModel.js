const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: String,
  },
  role: {
    type: String,
    required: true,
  },
  accessAllowed: {
    type: Boolean,
    default: true
  }
});

module.exports = User = mongoose.model('user', UserSchema);
