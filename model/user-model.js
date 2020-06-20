'use strict';

const userSchema = require('./user-schema');
require('../model/schema/articlesschema');
// const Model = require('../model/schema/general-model');
// const article = new Model(require('../model/schema/articlesschema'));

class User {
  constructor(userSchema) {
    this.schama = userSchema;
  }
  async read(record) {
    if (record) {
      let senc = await userSchema.findOne({ user_name: record }).populate('articles');
      return senc || null;
    } else {
      return await userSchema.find({}).populate('articles');
    }
  }
  async create(record) {
    let newUser = new userSchema(record);
    return await newUser.save(record);
  }
  async articleByUser(id1,id2){
    return await userSchema.findOneAndUpdate({ _id: id1 }, {$push: {articles: id2}}, { new: true });
  }

  async deleteArticle(id1,id2){  
    return await userSchema.findOneAndUpdate({ _id: id1 }, { $pull: {articles: id2} },{new:true});
  }
}

module.exports = new User();