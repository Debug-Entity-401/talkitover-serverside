'use strict';

const mongoose = require('mongoose');
const user = mongoose.Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phonNumber: { type: Number, required: true },
  country: { type: String },
  photo: { type: String },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  }],
  role: { type: String },
},{
  toJSON: {
    virtuals: true,
  },
});




module.exports = mongoose.model('user', user);