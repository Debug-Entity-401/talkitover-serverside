'use strict';

const express = require('express');
const oauth = require('../../middleware/oauth');
const router = express.Router();

router.get('/oauth', oauth, oauthHandler);

function oauthHandler(req, res) {
  //     console.log('---------------im here------------------------');
  let token = req.token;
  let day = 86400000;
  res.cookie('remember token', token, {
    expires: new Date(Date.now() + day),
    httpOnly: true,
  });
  res.status(200).send(token);
}
module.exports = router;
