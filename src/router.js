'use strict';

////require
const express = require('express'); const router = express.Router();

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

}

function profilePageHandler(req, res) {

}

function reviewsHandler(req, res) {

}

function postsHandler(req, res) {

}

function addpostsHandler(req, res) {
    
}

function editpostsHandler(req, res) {

}

function deletepostsHandler(req, res) {

}

function chatHandler(req, res) {

}

function addReviewHandler(req, res) {

}

function otherUserProfileHandler(req, res) {

}

function articlesHandler(req, res) {
    
}



