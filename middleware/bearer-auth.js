'use strict';

const users = require('../src/users');

module.exports = (req, res, next) => {
  // console.log('Bearer>>>>>>>', req.headers);
  if (!req.headers.cookie) {
    // console.log('bearer', req.headers.cookie);
    next('You Must Log-in');
    return;
  }
  const bearerToken = req.cookies['remember token'];
  // console.log('Bearer Token>>>>>>>>>>>', bearerToken);
  users.verifyToken(bearerToken).then(userInfo => {
    req.user = userInfo;
    next();
  }).catch(err => next('Invalid User Token'));
};