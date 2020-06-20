'use strict';

const mongoose = require('mongoose');

const articles = mongoose.Schema({
  title:{type:String,required:true},
  text:{type:String,required:true},
  status:{type:String,enum:['new','old'],required:true},
  url:{type:String,required:true},
});


module.exports = mongoose.model('articles',articles);
