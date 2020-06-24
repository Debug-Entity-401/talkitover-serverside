'use strict';

const users = require('../src/users');

module.exports = (req, res, next) => {
  if (!req.headers.cookie) {
    next('You Must Log-in');
    return;
  }
  const bearerToken = req.cookies['remember token'];
  users.verifyToken(bearerToken).then(userInfo => {
    req.user = userInfo;
    next();
  }).catch(err => next('Invalid User Token'));
};