'use strict';

////require
const express = require('express');
const router = express.Router();
const postmodule = require('../model/post-model');
const User = require('../model/user-model');
const bearerMiddleware = require('../middleware/bearer-auth');
// const aclMiddleware = require('../middleware/acl-middleware');


////////////////////

////routes
//main, home, and profiles
router.get('/register', registerHandler);
router.get('/home', bearerMiddleware, homePageHandler);
router.get('/profile', bearerMiddleware, profilePageHandler);
router.get('/otherprofile/:username', bearerMiddleware, otherUserProfileHandler);

//quotes
// router.get('quotes', quotesHandler);

//reviews
router.get('/reviews', bearerMiddleware, reviewsHandler);
router.get('/addreview', bearerMiddleware, addReviewHandler);

//posts
router.get('/talkitoverposts', bearerMiddleware, postsHandler);
router.post('/talkitoverposts', bearerMiddleware, aclMiddleware('POST'), addpostsHandler);
router.put('/talkitoverposts/:idpost', bearerMiddleware, editpostsHandler);
router.delete('/talkitoverposts/:idpost', bearerMiddleware, deletepostsHandler);
router.get('/chatroom', bearerMiddleware, chatHandler);

////////////////////

////route handlers
function registerHandler(req, res) {
  //a new page with a form to sign-in or sign-up and OAuth options (frontend)
  res.status(200).send('Sign-in Or Sign-up');
}

function homePageHandler(req, res) {
  //req.user --> user info
  const userInfo = req.user;
  res.status(200).send(`**This is Homepage**\nWelcome, ${userInfo.user_name}!`);

}

function profilePageHandler(req, res) {
  const userInfo = req.user;
  res.status(200).send(`**This is ${userInfo.user_name}'s Profile**\nWelcome, ${userInfo.user_name}!`);
}
//to see the reviews in my profile (added by other users)
function reviewsHandler(req, res) {

}

function postsHandler(req, res) {
  postmodule.read()
    .then(data => {
      res.status(200).json(data);
    });
}

function addpostsHandler(req, res) {
  let newpost = req.body;
  postmodule.create(newpost)
    .then(data => {
      res.status(201).json(data);
    });
}

function editpostsHandler(req, res) {
  let username = req.user.user_name;
  let idpost = req.params.idpost;
  let newpost = req.body;
  User.read(username)
    .then(data => {
      postmodule.readById(idpost)
        .then(postdata => {
          if (data.role === 'Administrators' || postdata[0].user_name === data.user_name) {
            postmodule.update(idpost, newpost)
              .then(data => {
                res.json(data);
              });
          } else {
            res.send('you connot update the post');
          }
        });
    });
}

function deletepostsHandler(req, res) {
  let username = req.user.user_name;
  let idpost = req.params.idpost;
  User.read(username)
    .then(data => {

      postmodule.readById(idpost)
        .then(postdata => {
          console.log('postdata', postdata[0].user_name);
          if (data.role === 'Administrators' || postdata[0].user_name === data.user_name) {
            postmodule.delete(idpost)
              .then(data => {
                res.send('post deleted');
              });
          } else {
            res.send('you connot delete');
          }
        });
    });
}

function chatHandler(req, res) {

}
//to add a review on another user's profile
function addReviewHandler(req, res) {
  // let userInfo = req.user;
  res.send('user review');

}

function otherUserProfileHandler(req, res) {
  req.user.capabilities = ['READ'];
  let username = req.params.username;
  // console.log(req.user);
  User.read(username)
    .then(otherUser => {
      if (otherUser[0].user_name !== req.user.user_name) {
        let otherUserInfo = {
          username: otherUser[0].user_name,
          email: otherUser[0].email,
          phone_number: otherUser[0].phoneNumber,
          country: otherUser[0].country,
          photo: otherUser[0].photo,
        };
        console.log(otherUserInfo);
        res.status(200).send(`Welcome to ${otherUser[0].user_name}'s Profile!\nUser Info:\n${JSON.stringify(otherUserInfo)}`);
      } else {
        req.user.capabilities = ['READ', 'CREATE'];
        res.redirect('/profile');
      }
    });
}





module.exports = router;