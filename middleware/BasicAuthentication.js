'use strict';

const base64 = require('base-64');
const users = require('../src/users');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const basic = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basic).split(':');
    users.authenticateBasic(user, pass)
      .then(validator => {
        req.token = users.getToken(validator);
        next();
      }).catch(err => {
        next('you must sign up');
      });
  }
};
