'use strict';

const errorHandler = require('../src/middleware/500');
let req = {};
let res = { status: function (s) { this.status = s; return this; }, json: () => { } };
let err = 'error from server';


describe('Error From server', () => {
  it('should respond with 500', () => {
    errorHandler(req, res,err);
    expect(res.status).toBe(500);
  });
});