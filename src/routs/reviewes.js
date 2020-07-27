'use strict';

const express = require('express');
const router = express.Router();
const acl = require('../../middleware/acl-middleware');
const bearer = require('../../middleware/bearer-auth');
const userModel = require('../../model/user-model');
router.post('/addreview/:username', bearer, acl('CREATE'), addReviewHandler);
router.delete('/deletereview/:username/:id', bearer, acl('DELETE REVIEW'), removeReview);

/**
 * 
 * @param {object} req
 *  the req will get the reviwer name from the req object and the reviewed username from the requet param  
 * @param {object} res 
 * the response will redirect to the reviwed page profile 
 */
function addReviewHandler(req, res) {
  //todo: wirte/add a review on another user's profile
  //a form/button will redirect me to the user profile, in the user profile I will have a button to add a review
  const date = new Date(Date.now());
  let current_date = date.toDateString();
  const reviewdUser = req.params.username;
  const reviewer = req.user.user_name;
  if (reviewdUser !== reviewer) {
    let newReview = req.body;
    newReview.date = current_date;
    userModel.addReview(reviewdUser, newReview)
      .then(review => {
        res.redirect(`/otherprofile/${reviewdUser}`);
      });
  } else {
    res.send('You cannot review yourself..');
  }
}

/**
 * 
 * @param {object} req
 *  the req will get the reviwer name and the reivew id from the req params  
 * @param {object} res 
 * the response will redirect to the reviwed page profile 
 */
function removeReview(req, res) {
  const username = req.params.username;
  const review_id = req.params.id;
  userModel.deleteReview(username, review_id)
    .then(res.redirect(`/otherprofile/${username}`));
}

module.exports = router;