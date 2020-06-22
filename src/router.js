'use strict';

////require
const express = require('express'); 
const router = express.Router();
const postmodule = require('../model/post-model');
const User = require('../model/user-model');
const bearerMiddleware = require('../middleware/bearer-auth');
const aclMiddleware = require('../middleware/acl-middleware');

////////////////////

////routes
//main, home, and profiles
router.get('/register', bearerMiddleware, registerHandler);
router.get('/home', bearerMiddleware, homePageHandler);
router.get('/profile', bearerMiddleware, profilePageHandler);
router.get('/otherprofile/:username', bearerMiddleware, otherUserProfileHandler);

//articles & quotes
// router.get('quotes', quotesHandler);
router.post('/user-articles/:idarticle', bearerMiddleware, addArticleUser);
router.get('/user-articles', bearerMiddleware, readOne);
router.delete('/user-articles/:idarticle', bearerMiddleware, deleteArticles);

//posts
router.get('/talkitoverposts', bearerMiddleware, postsHandler);
router.post('/talkitoverposts', bearerMiddleware, aclMiddleware('POST'), addpostsHandler);
router.put('/talkitoverposts/:idpost', bearerMiddleware, editpostsHandler);
router.delete('/talkitoverposts/:idpost', bearerMiddleware, deletepostsHandler);
// router.get('/chatroom', bearerMiddleware, chatHandler);

////////////////////

////route handlers
function registerHandler(req, res) {
  //a new page with a form to sign-in or sign-up and OAuth options (frontend)
  if (!req.user) {
    res.status(200).send('Sign-in Or Sign-up');
  }
  else {
    res.redirect('/home');
  }
}

function homePageHandler(req, res) {
  //req.user --> user info
  const userInfo = req.user;
  res.status(200).send(`**This is Homepage**\nWelcome, ${userInfo.user_name}!`);

}

function profilePageHandler(req, res) {
  //todo: show user's info in the profile page, including the articles and reviews (virtual joins)
  const user = req.user;
  const username = user.user_name;
  User.read(username)
    .then(userInfo => {
      // console.log('user info>>>>>>\n', userInfo);
      res.status(200).send(`**This is ${username}'s Profile**\nWelcome, ${username}!\nInfo:\n${JSON.stringify(userInfo)}`);
    });
}

function postsHandler(req, res) {
  postmodule.read()
    .then(data=>{
      res.status(200).json(data);
    });
}

function addpostsHandler(req, res) {
  let newpost=req.body;
  const date = new Date(Date.now());
  let current_date = date.toDateString();
  newpost.date = current_date;
  postmodule.create(newpost)
    .then(data=>{
      res.status(201).json(data);
    });
}

function editpostsHandler(req, res) {
  let username=req.user.user_name;
  let idpost=req.params.idpost;
  let newpost=req.body;
  User.read(username)
    .then(data=>{
      postmodule.readById(idpost)
        .then(postdata=>{
          if(postdata[0].user_name===data.user_name)
          {
            postmodule.update(idpost,newpost)
              .then(data=>{
                res.json(data);
              });
          }
          else
          {
            res.send('you connot update the post');
          }
        });
    });
}

function deletepostsHandler(req, res) {
  let username=req.user.user_name;
  let idpost=req.params.idpost;
  User.read(username)
    .then(data=>{
      postmodule.readById(idpost)
        .then(postdata=>{
          console.log('postdata',postdata[0].user_name);
          if(data.role ==='Administrators' || postdata[0].user_name===data.user_name)
          {
            postmodule.delete(idpost)
              .then(data=>{
                res.send('post deleted');
              });
          }
          else
          {
            res.send('you connot delete');
          }
        });
    });
}

// function chatHandler(req, res) {
//   res.redirect('/chat.html');
// }

function otherUserProfileHandler(req, res) {
  req.user.capabilities = ['READ', 'ADD REVIEW'];
  let username = req.params.username;
  // console.log(username);
  User.read(username)
    .then(otherUser => {
      if(otherUser.user_name !== req.user.user_name) {
        let otherUserInfo = {
          username: otherUser.user_name,
          photo: otherUser.photo,
          email: otherUser.email,
          phone_number: otherUser.phoneNumber,
          country: otherUser.country,
          reviews: otherUser.reviews,
          articles: otherUser.articles,
        };
        res.status(200).send(`Welcome to ${otherUser.user_name}'s Profile!\nUser Info:\n${JSON.stringify(otherUserInfo)}`);
      }
      else {
        req.user.capabilities = ['READ', 'CREATE'];
        res.redirect('/profile');
      }
    });
}

function addArticleUser(req,res){
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.articleByUser(id1,id2)
    .then(data =>{
      res.redirect('/profile');
    });
  
}
function readOne(req,res) {
  let userName = req.user.user_name;
  User.read(userName)
    .then(data =>{
      res.json(data);
    });  
}

function deleteArticles(req,res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.deleteArticle(id1,id2)
    .then(data =>{
      res.redirect('/profile');
    });
}



module.exports = router;
