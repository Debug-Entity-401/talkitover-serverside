'use strict';

const express = require('express');
const users = require('../users');
const signUp = require('../../model/user-model');
const router = express.Router();

router.post('/signup', signUpUser);

function signUpUser(req, res, next) {
  let userInfo = req.body;
  users.saveHash(userInfo)
    .then(saveInfo => {
      let admins = ['AlaaMs', 'Ammaro', 'BushraB', 'SondosA'];
      if (admins.includes(saveInfo.user_name)) {
        saveInfo.role = 'Administrators';
      } else {
        saveInfo.role = 'Writers';
      }
      signUp.create(saveInfo)
        .then(user => {
          let token = users.getToken(user);
          let day = 86400000;
          res.cookie('remember token', token, {
            expires: new Date(Date.now() + day),
            httpOnly: true,
          });
          res.status(201).send(token);
        }).catch(err => {
          res.status(403).send('Invalid Signup! email is taken');
        });
    });
}

module.exports = router;
