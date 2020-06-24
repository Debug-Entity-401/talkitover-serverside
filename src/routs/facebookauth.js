'use strict';

const express = require('express');
const oauth = require('../../middleware/oauth');
const router = express.Router();

router.get('/authorize', oauth, oauthHandler);

/**
 * 
 * @param {object} req 
  * it will set the token in the request and put an expiary date for the token
 * @param {object} res
 * it will send the token
 */
function oauthHandler(req, res) {
  let token = req.token;
  let day = 86400000;
  res.cookie('remember token', token, {
    expires: new Date(Date.now() + day),
    httpOnly: true,
  });
  res.status(200).redirect('/');
}
module.exports = router;