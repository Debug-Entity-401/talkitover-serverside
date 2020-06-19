'use strict';

const users = require('../src/users');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('you must log in');
    return;
  }
  const bearerToken = req.headers.authorization.split(' ').pop();
  users.verifyToken(bearerToken).then(userInfo => {
    req.user = userInfo;
    next();
  }).catch(err => next('Invalid User Token'));
};
