'use strict';

const express = require('express');
const barearAuth = require('../../middleware/bearer-auth');

const router = express.Router();

router.get('/signout', barearAuth, signoutHandler);
/**
 * 
 * @param {object} req 
 * it will extract the token the from the request header cookie
 * @param {object} res 
 * it will set the expiary date of the cookie with the token to the current momment so it will be deleted immediaitly then it will redirect to the main page 
 */
function signoutHandler(req, res) {
  console.log('signed out!');
  if(req.headers.cookie) {
    let token = req.headers.cookie.split('=');
    res.cookie('remember token', token, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.redirect('/');
  }
}

module.exports = router;
