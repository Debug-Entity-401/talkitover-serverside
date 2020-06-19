'use strict';
const mongoose = require('mongoose');

const posts = mongoose.Schema({
  user_name:{type:String,required:true},
  availability:{type:String,required:true},
  date:{type:String,required:true},
  description:{type:String,required:true},
});

module.exports = mongoose.model('posts',posts);