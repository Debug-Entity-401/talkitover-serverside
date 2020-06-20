'use strict';

////require
const express = require('express'); const router = express.Router();
const postmodule = require('../model/post-model');
const users = require('./users');
const bearerMiddleware = require('../middleware/bearer-auth');
const aclMiddleware = require('../middleware/acl-middleware');

////////////////////

////routes
router.get('/register', registerHandler);
router.get('/home', bearerMiddleware, homePageHandler);
router.get('/profile', bearerMiddleware, profilePageHandler);
// router.get('quotes', quotesHandler);
// router.get('/articles', articesHandler);
router.get('/reviews', bearerMiddleware, reviewsHandler);
router.get('/talkitoverposts', bearerMiddleware, postsHandler);
router.post('/talkitoverposts', bearerMiddleware, addpostsHandler);
router.put('/talkitoverposts/:id', bearerMiddleware, aclMiddleware, editpostsHandler);
router.delete('/talkitoverposts/:id', bearerMiddleware, aclMiddleware, deletepostsHandler);
router.get('/chatroom', bearerMiddleware, chatHandler);
router.get('/addreview', bearerMiddleware, addReviewHandler);
router.get('/otherprofile/:id', bearerMiddleware, otherUserProfileHandler);
//'/article' --> get, put(id - bearer, acl), delete(id - bearer, acl), post(bearer, acl)
router.get('/saved-articles', bearerMiddleware, articlesHandler); //user
router.post('/articles/:id', aclMiddleware, bearerMiddleware, articlesHandler);  //admin
router.put('/articles/:id', aclMiddleware, bearerMiddleware, articlesHandler);  //admin
router.delete('/articles/:id', aclMiddleware, bearerMiddleware, articlesHandler);  //admin
router.delete('/saved-articles/:id', bearerMiddleware, articlesHandler); //user

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

function reviewsHandler(req, res) {

}

function postsHandler(req, res) {
  postmodule.read()
    .then(data=>{
      res.status(200).json(data);
    });
}

function addpostsHandler(req, res) {
  let newpost=req.body;
  let userid=req.user.id;
  postmodule.create(newpost)
    .then(data=>{
      res.status(201).json(data);
    });
}

function editpostsHandler(req, res) {
  let newpost=req.body;
  let id=req.params.id;
  postmodule.update(id,newpost)
    .then(data=>{
      res.json(data);
    });
}

function deletepostsHandler(req, res) {
  let id=req.params.id;
  let userid=req.user.id;
  postmodule.delete(id)
    .then(data=>{
      res.send('post deleted');
    });
}

function chatHandler(req, res) {

}

function addReviewHandler(req, res) {

}

function otherUserProfileHandler(req, res) {

}

function articlesHandler(req, res) {
    
}


module.exports = router;
