'use strict';

const express = require('express');
const basicAuth = require('../../middleware/BasicAuthentication');
const model = require('../../model/user-model');
const bearer = require('../../middleware/bearer-auth');
const router = express.Router();

router.post('/signin', basicAuth, signinUser);
// add new routs for articles
router.post('/user/find/:idarticle',bearer,addArticleUser);
router.get('/user',bearer,readOne);
router.delete('/user/:idarticle',bearer,deleteArticles);

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
// add functions for articles
function addArticleUser(req,res){
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  model.articleByUser(id1,id2)
    .then(data =>{
      res.json(data);
    });
  
}
function readOne(req,res) {
  let userName = req.user.user_name;
  model.read(userName)
    .then(data =>{
      res.json(data);
    });  
}

function deleteArticles(req,res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  console.log('me too ====>',id1);
  model.deleteArticle(id1,id2)
    .then(data =>{
      res.json(data);
    });
}


module.exports = router;
