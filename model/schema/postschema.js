'use strict';

const mongoose = require('mongoose');

const posts = mongoose.Schema({
  user_name:{type:String, required:true},
  view_as:{type:String, default: 'Anonymous'},
  availability:{type:String,required:true},
  date:{type:String,required:true},
  description:{type:String,required:true},
  solved:{type:Boolean},
});

module.exports = mongoose.model('posts',posts);
