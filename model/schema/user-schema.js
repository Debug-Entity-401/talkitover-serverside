'use strict';
const mongoose = require('mongoose');
const user = mongoose.Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String },
  photo: { type: String },
  status: { type: String },
  articles: [{ //add for virtual join
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  }],
  reviews: [{
    reviewer_name: { type: String, default: 'Anonymous' },
    date: { type: Date, required: true },
    rating: { type: String, enum: ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'], required: true },
    review_description: { type: String, required: false },
  }],
  role: { type: String },
}, {
  toJSON: {
    virtuals: true,
  },
});


module.exports = mongoose.model('user', user);