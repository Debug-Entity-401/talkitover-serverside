'use strict';
////require
require('dotenv').config();
const express = require('express');
const router = express.Router();
const postmodule = require('../model/post-model');
const User = require('../model/user-model');
const Model = require('../model/general-model');
const articles = new Model(require('../model/schema/articlesschema'));
const bearerMiddleware = require('../middleware/bearer-auth');
const aclMiddleware = require('../middleware/acl-middleware');
const jwt = require('jsonwebtoken');
////////////////////
//main, home, and profiles
router.post('/assessment', registerHandler);
router.get('/home', bearerMiddleware, homePageHandler);
router.put('/profile/:id', editProfilePageHandler);
router.get('/profile', bearerMiddleware, profilePageHandler);
router.get('/otherprofile/:username', bearerMiddleware, otherUserProfileHandler);
//articles & quotes

router.post('/user-articles/:idarticle', bearerMiddleware, addArticleUser);
router.get('/user-articles', bearerMiddleware, readOne);
router.delete('/user-articles/:idarticle', bearerMiddleware, deleteArticles);
//posts
router.get('/talkitoverposts', bearerMiddleware, postsHandler);
router.post('/talkitoverposts', bearerMiddleware, aclMiddleware('POST'), addpostsHandler);
router.put('/talkitoverposts/:idpost', bearerMiddleware, editpostsHandler);
router.delete('/talkitoverposts/:idpost', bearerMiddleware, deletepostsHandler);

////////////////////

/**
 * 
 * @param {object} req
 * check if the req contains the user in the header 
 * @param {object} res 
 * return the status of the user
 */
function registerHandler(req, res) {
  let score = req.body.score;
  // console.log('score ===> ',req.body);
  var status;
  if (!req.user) {
    // var inquirer = require('inquirer');
    // var score = 0;
    // let Q1 = [
    //   '1. Anxity',
    //   '2. Chronic Pain',
    //   '3. Breakups',
    //   '4. Bipolar',
    //   '5. Domestic Violence',
    //   '6. Eating Disorders',
    //   '7. Family Stress',
    //   '8. Loneliness',
    //   '9. Managing Emotions',
    // ];
    // (async() => {
    //   const ans1 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'mentalissue',
    //     message: 'Whats on your mind? Select an issue below that best describes the reason you are here:?',
    //     default: 'Jake',
    //     choices: Q1,
    //   } ]);
    //   let Q2 = [
    //     `1. No Struggle`,
    //     `2. Mild Struggle`,
    //     `3. Moderate Struggle`,
    //     `4. Significant Struggle`,
    //   ];
    //   const ans2 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'Question2',
    //     message: `Dealing with ${ans1.mentalissue.split(' ').splice(1).join(' ')} causes me:`,
    //     choices: Q2,
    //   } ]);
    //   let Q3 = [
    //     '1. Never',
    //     '2. Once in a While',
    //     '3. Some of the Time',
    //     '4. Frequently',
    //   ];
    //   const ans3 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'Question3',
    //     message: `${ans1.mentalissue.split(' ').splice(1).join(' ')} impacts my work, school, or relationships:`,
    //     choices: Q3,
    //   } ]);
    //   let Q4 = [
    //     '1. Not Really Important',
    //     '2. Somewhat Important',
    //     '3. Important',
    //     '4. Very Important',
    //   ];
    //   const ans4 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'Question4',
    //     message: `Learning how to better manage ${ans1.mentalissue.split(' ').splice(1).join(' ')} is:`,
    //     choices: Q4,
    //   } ]);
    //   let Q5 = [
    //     '1. Id rather not answer at this time',
    //     '2. Ive sought professional help one time in the past.',
    //     '3. Ive sought professional help several times before this.',
    //     '4. Ive sought professional help multiple times in the past.',
    //   ];
    //   const ans5 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'Question5',
    //     message: `Have you ever sought or received professional help (therapy, counseling, self-help, group support, or medication) for ${ans1.mentalissue.split(' ').splice(1).join(' ')} is:`,
    //     choices: Q5,
    //   } ]);
    // let Q6 = [
    //   '1. I am not ready to change in the next 3 months',
    //   '2. I am thinking about changing in the next 3 months',
    //   '3. I am thinking about changing in the next month',
    //   '4. I am ready to make a change today',
    //   '5. I have already made some progress',
    // ];
    // const ans6 = await inquirer.prompt([{
    //   type: 'list',
    //   name: 'Question6',
    //   message: `How ready are you to make a change in your life?:`,
    //   choices: Q6,
    // } ]);
    // let Q7 = [
    //   '1. Not at all',
    //   '2. Several days',
    //   '3. More than half the days',
    //   '4. Nearly every day',
    // ];
    // const ans7 = await inquirer.prompt([{
    //   type: 'list',
    //   name: 'Question7',
    //   message: `Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?:`,
    //   choices: Q7,
    // } ]);
    // let Q8 = [
    //   '1. Not at all',
    //   '2. Several days',
    //   '3. More than half the days',
    //   '4. Nearly every day',
    // ];
    // const ans8 = await inquirer.prompt([{
    //   type: 'list',
    //   name: 'Question8',
    //   message: `Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead or of hurting yourself in some way?:`,
    //   choices: Q8,
    // } ]);
    // let Q9 = [
    //   '1. Not difficult at all',
    //   '2. Somewhat difficult',
    //   '3. Very difficult',
    //   '4. Extremely difficult',
    // ];
    // const ans9 = await inquirer.prompt([{
    //   type: 'list',
    //   name: 'Question9',
    //   message: `If you selected any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?:`,
    //   choices: Q9,
    // } ]);
    // let Q10 = [
    //   '1. Not at all',
    //   '2. Several days',
    //   '3. Over half the days',
    //   '4. Nearly every day',
    // ];
    // const ans10 = await inquirer.prompt([{
    //   type: 'list',
    //   name: 'Question10',
    //   message: `Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?:`,
    //   choices: Q10,
    // } ]);
    // let result = {...ans1, ...ans2, ...ans3, ...ans4, ...ans5, ...ans6, ...ans7, ...ans8, ...ans9, ...ans10 };
    // let result = {...ans1, ...ans2, ...ans3, ...ans4, ...ans5};
    // score = 3 + Q2.indexOf(result.Question2) + Q3.indexOf(result.Question3) + Q4.indexOf(result.Question4) + Q5.indexOf(result.Question5);

    if (score < 5) {
      status = 'good';
      console.log('\n---------------------------\n score : ', score);
      console.log(' status : ', status, '\n---------------------------\n');
        
    } else if (score >= 5 && score <= 10) {
      status = 'need help';
      console.log('\n---------------------------\n score : ', score);
      console.log(' status : ', status, '\n---------------------------\n');
        
    } else if (score > 10) {
      status = 'extreme help';
      console.log('\n---------------------------\n score : ', score);
      console.log(' status : ', status, '\n---------------------------\n');
        
    }
    // })()
    //   .then((data) => {
    let username = req.body.token;
    return jwt.verify(username, process.env.SECRET, async function (err, decoded) {
      let decodedusername = decoded.user_name;
      User.assmentcreate(decodedusername, status);
      res.send({user_name:decodedusername,status});
      // res.redirect('/home');
    } );
  }
  // })
  // .catch(console.error);
  //a new page with a form to sign-in or sign-up and OAuth options (frontend)
  
  // else {
  //   res.redirect('/profile');
  // }
}


/**
 * 
 * @param {object} req
 * get the user object from the request  
 * @param {object} res
 * send a welcome message to the user 
 */
function homePageHandler(req, res) {
  const userInfo = req.user;
  // let status = 'new';
  // let newArticlesArray = [];
  // articles.read(status)
  //   .then(newArticles => {
  //     newArticles.forEach(article => {
  //       let articleObj = {
  //         title: article.title,
  //         description: article.text,
  //         url: article.url,
  //       };
  //       newArticlesArray.push(articleObj);
  //     });
  //   });
  res.status(200).send(userInfo.user_name);
}

/**
 * 
 * @param {Object} req
 * get the user object from the req 
 * @param {Object} res 
 * send the public user information from the database
 */

async function profilePageHandler(req, res) {
  //todo: show user's info in the profile page, including the articles and reviews (virtual joins)
  const user = await req.user;
  const username = await user.user_name;
  await User.read(username)
    .then(data => {
      let userInfo = {
        username: data.user_name,
        photo: data.photo,
        email: data.email,
        country: data.country,
        reviews: data.reviews,
        articles: data.articles,
        id: data._id,
      };
      //     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.status(200).send(JSON.stringify(userInfo));
    });
}
async function editProfilePageHandler(req, res) {
  let id = req.params.id;
  let Photo = await req.body.photo;
  let country = await req.body.country;
  let email = await req.body.email;
  let phonNumber = await req.body.phonNumber;
  let user_name = await req.body.user_name;
  await User.updateProfile(id, Photo, country, email, phonNumber, user_name)
    .then(data => {
      res.status(200).json(data);
    });
}
/**
 * 
 * @param {object} res
 *it will return all the posts 
 */
function postsHandler(req, res) {
  postmodule.read()
    .then(data => {
      res.status(200).json(data);
    });
}
/**
 * 
 * @param {Object} req 
 * will get the post information from the request body
 * @param {object} res 
 * it will return the created post
 */
function addpostsHandler(req, res) {
  let newpost = req.body;
  const date = new Date(Date.now());
  let current_date = date.toDateString();
  newpost.date = current_date;
  postmodule.create(newpost)
    .then(data => {
      res.status(201).json(data);
    });
}
/**
 * 
 * @param {object} req
 * it will get the username from the request object and the post if from the req param and get the post edits from the request body
 * @param {object} res 
 * it will send the updated post
 */
function editpostsHandler(req, res) {
  let username = req.user.user_name;
  let idpost = req.params.idpost;
  let newpost = req.body;
  User.read(username)
    .then(data => {
      postmodule.readById(idpost)
        .then(postdata => {
          if (postdata[0].user_name === data.user_name) {
            postmodule.update(idpost, newpost)
              .then(data => {
                res.json(data);
              });
          } else {
            res.send('you connot update the post');
          }
        });
    });
}
/**
 * 
 * @param {object} req
 * it will get the username from the request object and the post if from the req param 
 * @param {object} res 
 * it will return a message if the post is deleted
 */
function deletepostsHandler(req, res) {
  let username = req.user.user_name;
  let idpost = req.params.idpost;
  User.read(username)
    .then(data => {
      postmodule.readById(idpost)
        .then(postdata => {
          if (data.role === 'Administrators' || postdata[0].user_name === data.user_name) {
            postmodule.delete(idpost)
              .then(data => {
                res.send('post deleted');
              });
          } else {
            res.send('you connot delete');
          }
        });
    });
}


/**
 * 
 * @param {object} req
 * it will get the username from the request params and it will edit the user capablity in the request object
 * @param {object} res 
 * it will show the  public user profile
 */
function otherUserProfileHandler(req, res) {
  req.user.capabilities = ['READ', 'ADD REVIEW'];
  let username = req.params.username;
  User.read(username)
    .then(otherUser => {
      if (otherUser.user_name !== req.user.user_name) {
        let otherUserInfo = {
          username: otherUser.user_name,
          photo: otherUser.photo,
          email: otherUser.email,
          country: otherUser.country,
          reviews: otherUser.reviews,
        };
        res.status(200).send(`Welcome to ${otherUser.user_name}'s Profile!\nUser Info:\n${JSON.stringify(otherUserInfo)}`);
      } else {
        req.user.capabilities = ['READ', 'CREATE'];
        res.redirect('/profile');
      }
    });
}

/**
 * 
 * @param {object} req 
 * it will get the username from the request object and get article id from request params
 * @param {object} res 
 * it will redirect to the profile page
 */
function addArticleUser(req, res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.articleByUser(id1, id2)
    .then(data => {
      res.redirect('/profile');
    });
}


/**
 * 
 * @param {Object} req 
 * it will get the username from the request object  
 * @param {Object} res 
 * it will return the user details including the saved article 
 */


function readOne(req, res) {
  let userName = req.user.user_name;
  User.read(userName)
    .then(data => {
      res.json(data);
    });
}
/**
 * 
 * @param {Object} req 
 * it will get the username from the request object and articleid from the params  
 * @param {Object} res 
 * it will redirect to the user profile
 */

function deleteArticles(req, res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.deleteArticle(id1, id2)
    .then(data => {
      res.redirect('/profile');
    });
}
module.exports = router;