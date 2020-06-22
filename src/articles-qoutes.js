
'use strict';

const express = require('express');
const route = express.Router();
const Model = require('../model/general-model');
const article = new Model(require('../model/schema/articlesschema'));
const acl = require('../middleware/acl-middleware');
const bearer = require('../middleware/bearer-auth');


route.get('/getAll',bearer,acl('READ'),getAll);
route.put('/update/:id',bearer,acl('UPDATE'),updateArt);
route.delete('/remove/:id',bearer,acl('DELETE'),remove);
route.post('/add',bearer,acl('CREATE'),addArticle);

function getAll(req,res,next){
  let status = req.query.status;
  article.read(status)
    .then(all =>{
      res.json(all);
    });
}
function addArticle(req,res,next){
  let newArticle = req.body;
  article.create(newArticle)
    .then(newArt =>{
      res.json(newArt);
    });
  
}

function updateArt(req,res,next){
  let newArticle = req.body;
  let id = req.params.id;
  article.update(id,newArticle)
    .then(newArt =>{
      res.json(newArt);
    });
}

function remove(req,res,next){
  let id = req.params.id;
  article.delete(id)
    .then(()=>{
      res.send('the article deleted');
    });
  
}



module.exports = route;