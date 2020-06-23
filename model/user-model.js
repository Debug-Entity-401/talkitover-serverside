'use strict';
const userSchema = require('./schema/user-schema');
require('../model/schema/articlesschema');
class User {
  constructor(userSchema) {
    this.schama = userSchema;
  }
  async readUser(record) {
    if (record) {
      let senc = await userSchema.find({ user_name: record });
      return senc || null;
    } else {
      return await userSchema.find({});
    }
  }

  /**
 * 
 * @param {string} record  function that wil return the acssess token
 */
  async read(record) {
    if (record) { //add populate for join
      let userRecord = await userSchema.findOne({ user_name: record }).populate('articles');
      return userRecord || null;
    } else { //add populate for join
      return await userSchema.find({}).populate('articles');
    }
  }
  async create(record) {
    let newUser = new userSchema(record);
    return await newUser.save(record);
  }
  async assmentcreate(username, data) {
    return await userSchema.findOneAndUpdate({ user_name: username, status: data });

  }

  async addReview(username, review) {
    return await userSchema.findOneAndUpdate({ user_name: username }, { $push: { reviews: review } }, { new: true });
  }

  async deleteReview(username, id) {
    return userSchema.findOne({ user_name: username }, { reviews: { $elemMatch: { _id: id } } })
      .then(async record => {
        console.log('inside then>>>>>>>>>>', record.reviews[0]);
        return await userSchema.findOneAndUpdate({ user_name: username }, { $pull: { reviews: record.reviews[0] } }, { new: true });
      });
  }

  //add two functions
  async articleByUser(id1, id2) {
    return await userSchema.findOneAndUpdate({ user_name: id1 }, { $push: { articles: id2 } }, { new: true });
  }

  async deleteArticle(id1, id2) {
    return await userSchema.findOneAndUpdate({ user_name: id1 }, { $pull: { articles: id2 } }, { new: true });
  }
}
///
module.exports = new User();