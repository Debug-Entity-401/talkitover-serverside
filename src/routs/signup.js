'use strict';

const express = require('express');
const users = require('../users');
const signUp = require('../../model/user-model');
const router = express.Router();

router.post('/signup', signUpUser);

/**
 * 
 * @param {object} req
 * the req will send the information in the request body and it set the token in the request header
 * @param {object} res 
 * it will send back the token
 * 
 */
function signUpUser(req, res, next) {
  let userInfo = req.body;
  users.saveHash(userInfo)
    .then(saveInfo => {
      let admins = ['AlaaMs', 'Ammaro', 'BushraB', 'SondosA'];
      if (admins.includes(saveInfo.user_name)) {
        saveInfo.role = 'Administrators';
      } // edite the defult role 
      signUp.create(saveInfo)
        .then(user => {
          let token = users.getToken(user);
          req.headers.Authorization = `Token ${token}`;
          let day = 86400000;
          res.cookie('remember token', token, {
            expires: new Date(Date.now() + day),
            httpOnly: true,
          });
          res.send(token);
        }).catch(err => {
          res.status(403).send('Invalid Signup! email is taken');
        });
    });
}

module.exports = router;