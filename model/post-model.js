'use strict';

const Model = require('./general-model');

const schema = require('./schema/postschema');

class Posts extends Model {
  constructor() {
    super(schema);
  }
}  
module.exports = new Posts();
