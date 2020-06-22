'use strict';

const Model = require('./general-model');

const schema = require('./schema/reviews-schema');

class Reviews extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = new Reviews();
