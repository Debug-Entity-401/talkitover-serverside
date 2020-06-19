'use strict';

////require
const express = require('express'); const router = express.Router();
//require the models and the middlewares...

////////////////////

////routes
router.get('/register', registerHandler);
router.get('oauth', oauthMiddleware, oauthHandler);
router.post('/signup', signupHandler);
router.post('/signin', basicMiddleware, signinHandler);
router.get('/home', bearerMiddleware, homePageHandler);
router.get('/profile', bearerMiddleware, profilePageHandler);
// router.get('quotes', quotesHandler);
// router.get('/articles', articesHandler);
router.get('/reviews', bearerMiddleware, reviewsHandler);
router.get('/talkitoverposts', bearerMiddleware, postsHandler);
router.post('/talkitoverposts', bearerMiddleware, addpostsHandler);
router.put('/talkitoverposts/:id', bearearMiddleware, aclMiddleware, editpostsHandler);
router.delete('/talkitoverposts/:id', bearearMiddleware, aclMiddleware, deletepostsHandler);
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

function oauthHandler(req, res) {
  //add user token in cookies
  // tokens are added to the request body from the oauth middleware fuction
  res.cookie('token', req.token, {httpOnly: false});
  res.status(200).send(req.token);
}

async function signupHandler(req, res) {
//depends on the users model

//   try{
//     const user = await users.save(req.body);
//     const token = users.generateToken(user);
//     res.cookie('token', req.token, {httpOnly: false});
//     res.status(200).json({token});
//   }
//   catch(err){
//     res.status(403).send(err.message);
//   }
}

function signinHandler(req, res) {
  //token and user are added to the request body from the basicauth middleware fuction
  res.cookie('token', req.token, {httpOnly: false});
  res.status(200).json({token: req.token, user: req.user});
}

function bearerHandler(req, res) {

}
