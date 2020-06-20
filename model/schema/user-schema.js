'use strict';

const mongoose = require('mongoose');

const user = mongoose.Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phonNumber: { type: String, required: true },
  country: { type: String },
  photo: { type: String },
  role: { type: String },
});


module.exports = mongoose.model('user', user);
