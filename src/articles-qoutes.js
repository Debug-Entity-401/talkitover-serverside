'use strict';

const express = require('express');
const route = express.Router();
const Model = require('../model/general-model');
const article = new Model(require('../model/schema/articlesschema'));
const acl = require('../middleware/acl-middleware');
const bearer = require('../middleware/bearer-auth');

route.get('/admin',bearer,adminPage);
route.get('/articles', bearer, acl('READ'), getAll);
route.put('/articles/:id', bearer, acl('UPDATE'), updateArt);
route.delete('/articles/:id', bearer, acl('DELETE'), remove);
route.post('/articles', bearer, acl('CREATE'), addArticle);

/**
 * 
 * @param {object} req
 * @param {object} res 
 */
function adminPage(req,res){
  if(req.user.capabilities.length === 5){
    res.send('You are in admin Page');
  }
  else console.error('error');
}


function getAll(req, res, next) {
  let status = req.query.status;
  article.read(status)
    .then(all => {
      res.json(all);
    });
}

function addArticle(req, res, next) {
  let newArticle = req.body;
  article.create(newArticle)
    .then(newArt => {
      res.json(newArt);
    });

}

function updateArt(req, res, next) {
  let newArticle = req.body;
  let id = req.params.id;
  article.update(id, newArticle)
    .then(newArt => {
      res.json(newArt);
    });
}

function remove(req, res, next) {
  let id = req.params.id;
  article.delete(id)
    .then(() => {
      res.send('the article deleted');
    });

}



module.exports = route;