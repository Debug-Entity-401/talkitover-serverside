'use strict';

const express = require('express');
const basicAuth = require('../../middleware/BasicAuthentication');
const model = require('../../model/user-model');
const router = express.Router();

router.post('/signin', basicAuth, signinUser);
router.post('/user/find/:id1/:id2',addArticleUser);
router.get('/user/:username',readOne);
router.delete('/user/:username/:id',deleteArticle);

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
  let id1 = req.params.id1;
  let id2 = req.params.id2;
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

function deleteArticle(req,res) {
  let userName = req.params.username;
  let id = req.params.id;
  model.read(userName)
    .then(data =>{
      let index = data.articles.findIndex(x => x._id == id);
      console.log('index     ===',index);
      data.articles.splice(index,1);
      console.log('data    =====',data.articles.length);
      res.json(data);
    }); 
}


module.exports = router;
