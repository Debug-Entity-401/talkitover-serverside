'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    try {
      console.log('capability  ===',capability);
      console.log('user ',req.user);
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (err) {
      next('invalid log in', err);
    }
  };
};
