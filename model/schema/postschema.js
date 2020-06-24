'use strict';

const mongoose = require('mongoose');

const posts = mongoose.Schema({
  user_name:{type:String, default: 'Anonymous'},
  availability:{type:String,required:true},
  date:{type:String,required:true},
  description:{type:String,required:true},
});

module.exports = mongoose.model('posts',posts);
