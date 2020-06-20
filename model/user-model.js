'use strict';
<<<<<<< HEAD

const userSchema = require('./schema/user-schema');
=======
const userSchema = require('./user-schema');
require('../model/schema/articlesschema');
>>>>>>> 13130c37c8b1f3cb53f5d6bb1be81c2a07cc6091

class User {
  constructor(userSchema) {
    this.schama = userSchema;
  }
  async read(record) {
<<<<<<< HEAD
    if (record) {
      let userRecord = await userSchema.find({ user_name: record });
      return userRecord || null;
    } else {
      return await userSchema.find({});
=======
    if (record) { //add populate for join
      let senc = await userSchema.findOne({ user_name: record }).populate('articles');
      return senc || null;
    } else { //add populate for join
      return await userSchema.find({}).populate('articles');
>>>>>>> 13130c37c8b1f3cb53f5d6bb1be81c2a07cc6091
    }
  }
  async create(record) {
    let newUser = new userSchema(record);
    return await newUser.save(record);
  }
  //add two functions
  async articleByUser(id1,id2){
    return await userSchema.findOneAndUpdate({ user_name: id1 }, {$push: {articles: id2}}, { new: true });
  }

  async deleteArticle(id1,id2){  
    return await userSchema.findOneAndUpdate({ user_name: id1}, { $pull: {articles: id2} },{new:true});
  }
}
///
module.exports = new User();