'use strict';

const express = require('express');
const basicAuth = require('../../middleware/BasicAuthentication');
const model = require('../../model/user-model');
const router = express.Router();

router.post('/signin', basicAuth, signinUser);
router.post('/user/find/:iduser/:idarticle',addArticleUser);
router.get('/user/:username',readOne);
router.delete('/user/:id1/:id2',deleteArticles);

function signinUser(req, res) {
  let token = req.token;
  let day = 86400000;
  res.cookie('remember token', token, {
    expires: new Date(Date.now() + day),
    httpOnly: true,
  });
  res.status(201).send(token);
}

function addArticleUser(req,res){
  let id1 = req.params.iduser;
  let id2 = req.params.idarticle;
  model.articleByUser(id1,id2)
    .then(data =>{
      res.json(data);
    });
  
}
function readOne(req,res) {
  let userName = req.params.username;
  model.read(userName)
    .then(data =>{
      res.json(data);
    });  
}

function deleteArticles(req,res) {
  let id1 = req.params.id1;
  let id2 = req.params.id2;
  model.deleteArticle(id1,id2)
    .then(data =>{
      res.json(data);
    });
}


module.exports = router;
