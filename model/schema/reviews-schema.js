'use strict';

const mongoose = require('mongoose');

//Note: Mongoose only applies a default if the value of the path is strictly undefined

const reviews = mongoose.Schema({
  reviewer_name: {type: String, default: 'Anonymous', required: true},
  // date: {type: Date, required: true},
  rating: {type: String, enum:['1 star', '2 stars', '3 stars', '4 stars', '5 stars'], required: true},
  review_description: {type: String, required: false},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
});

module.exports = mongoose.model('reviews', reviews);
