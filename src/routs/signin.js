'use strict';

const express = require('express');
const basicAuth = require('../../middleware/BasicAuthentication');
const bearerAuth = require('../../middleware/bearer-auth');
const router = express.Router();

router.post('/signin', basicAuth, signinUser);
router.get('/secret', bearerAuth, datauser );
function signinUser(req, res) {
  let token = req.token;
  let day = 86400000;
  res.cookie('remember token', token, {
    expires: new Date(Date.now() + day),
    httpOnly: true,
  });
  // console.log(req.token);
  res.status(201).redirect('/home');
  // res.status(201).send(token);
}

function datauser(req,res)
{
  res.json(req.user);

}

module.exports = router;
