'use strict';

const userSchema = require('./user-schema');

class User {
  constructor(userSchema) {
    this.schama = userSchema;
  }
  async read(record) {
    if (record) {
      let senc = await userSchema.find({ user_name: record });
      return senc || null;
    } else {
      return await userSchema.find({});
    }
  }
  async create(record) {
    let newUser = new userSchema(record);
    return await newUser.save(record);
  }
}

module.exports = new User();