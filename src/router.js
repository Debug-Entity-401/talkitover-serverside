'use strict';
////require
require('dotenv').config();
const express = require('express');
const router = express.Router();
const postmodule = require('../model/post-model');
const User = require('../model/user-model');
const bearerMiddleware = require('../middleware/bearer-auth');
const aclMiddleware = require('../middleware/acl-middleware');
const jwt = require('jsonwebtoken');
////////////////////
////routes
//main, home, and profiles
router.post('/assessment', registerHandler);
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
router.put('/talkitoverposts/:idpost', bearerMiddleware,  editpostsHandler);
router.delete('/talkitoverposts/:idpost', bearerMiddleware,  deletepostsHandler);
router.get('/chatroom', bearerMiddleware, chatHandler);

////////////////////

////route handlers
function registerHandler(req, res) {
  if (!req.user) {
    var inquirer = require('inquirer');
    var score = 0;
    let Q1 = [
      '1. Anxity',
      '2. Chronic Pain',
      '3. Breakups',
      '4. Bipolar',
      '5. Domestic Violence',
      '6. Eating Disorders',
      '7. Family Stress',
      '8. Loneliness',
      '9. Managing Emotions',
    ];
    (async () => {
      const ans1 = await inquirer.prompt([
        {
          type: 'list',
          name: 'mentalissue',
          message: 'Whats on your mind? Select an issue below that best describes the reason you are here:?',
          default: 'Jake',
          choices: Q1,
        },
      ]);
      let Q2 = [

        `1. No ${ans1.mentalissue.split(' ').splice(1).join(' ')}`,
        `2. Mild ${ans1.mentalissue.split(' ').splice(1).join(' ')}`,
        `3. Moderate ${ans1.mentalissue.split(' ').splice(1).join(' ')}`,
        `4. Significant ${ans1.mentalissue.split(' ').splice(1).join(' ')}`,
      ];


      const ans2 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question2',
          message: `Dealing with ${ans1.mentalissue.split(' ').splice(1).join(' ')} causes me:`,
          choices: Q2,
        },
      ]);
      let Q3 = [
        '1. Never',
        '2. Once in a While',
        '3. Some of the Time',
        '4. Frequently',
      ];
      const ans3 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question3',
          message: `${ans1.mentalissue.split(' ').splice(1).join(' ')} impacts my work, school, or relationships:`,
          choices: Q3,
        },
      ]);
      let Q4 = [
        '1. Not Really Important',
        '2. Somewhat Important',
        '3. Important',
        '4. Very Important',
      ];
      const ans4 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question4',
          message: `Learning how to better manage ${ans1.mentalissue.split(' ').splice(1).join(' ')} is:`,
          choices: Q4,
        },
      ]);
      let Q5 = [
        '1. Id rather not answer at this time',
        '2. Ive sought professional help one time in the past.',
        '3. Ive sought professional help several times before this.',
        '4. Ive sought professional help multiple times in the past.',
      ];
      const ans5 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question5',
          message: `Have you ever sought or received professional help (therapy, counseling, self-help, group support, or medication) for ${ans1.mentalissue} is:`,
          choices: Q5,
        },
      ]);

      let Q6 =
        [
          '1. I am not ready to change in the next 3 months',
          '2. I am thinking about changing in the next 3 months',
          '3. I am thinking about changing in the next month',
          '4. I am ready to make a change today',
          '5. I have already made some progress',
        ];
      const ans6 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question6',
          message: `How ready are you to make a change in your life?:`,
          choices: Q6,
        },
      ]);
      let Q7 =
        [
          '1. Not at all',
          '2. Several days',
          '3. More than half the days',
          '4. Nearly every day',
        ];
      const ans7 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question7',
          message: `Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?:`,
          choices: Q7,
        },
      ]);
      let Q8 = [
        '1. Not at all',
        '2. Several days',
        '3. More than half the days',
        '4. Nearly every day',
      ];
      const ans8 = await inquirer.prompt([
        {

          type: 'list',
          name: 'Question8',
          message: `Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead or of hurting yourself in some way?:`,
          choices: Q8,
        },
      ]);
      let Q9 = [
        '1. Not difficult at all',
        '2. Somewhat difficult',
        '3. Very difficult',
        '4. Extremely difficult',
      ];
      const ans9 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question9',
          message: `If you selected any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?:`,
          choices: Q9,
        },
      ]);
      let Q10 = [
        '1. Not at all',
        '2. Several days',
        '3. Over half the days',
        '4. Nearly every day',
      ];
      const ans10 = await inquirer.prompt([
        {
          type: 'list',
          name: 'Question10',
          message: `Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?:`,
          choices: Q10,
        },
      ]);
      var status;
      let result = { ...ans1, ...ans2, ...ans3, ...ans4, ...ans5, ...ans6, ...ans7, ...ans8, ...ans9, ...ans10 };
      score = 3 + Q2.indexOf(result.Question2) + Q3.indexOf(result.Question3) + Q4.indexOf(result.Question4) + Q5.indexOf(result.Question5) + Q6.indexOf(result.Question6) + Q7.indexOf(result.Question7)
        + Q8.indexOf(result.Question8) + Q9.indexOf(result.Question9) + Q10.indexOf(result.Question10);
      if (score < 10) {
        status = 'good';
        return status;
      }
      else if (score >= 10 && score <= 20) {

        status = 'need help';
        return status;
      }
      else if (score > 20) {
        status = 'extreme help';
        return status;
      }

    })()
      .then((data) => {
        let username = req.headers.cookie.split('=');
        return jwt.verify(username[1], process.env.SECRET, async function (err, decoded) {
          let decodedusername = decoded.user_name;
          console.log('token username', decodedusername);
          User.assmentcreate(decodedusername, data);

          res.redirect('/home');
        },
        );
      })

      .catch(console.error);
    //a new page with a form to sign-in or sign-up and OAuth options (frontend)

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
    .then(data => {
      res.status(200).json(data);
    });
}

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
          }
          else {
            res.send('you connot update the post');
          }
        });
    });
}

function deletepostsHandler(req, res) {
  let username = req.user.user_name;
  let idpost = req.params.idpost;
  User.read(username)
    .then(data => {
      postmodule.readById(idpost)
        .then(postdata => {
          console.log('postdata', postdata[0].user_name);
          if (data.role === 'Administrators' || postdata[0].user_name === data.user_name) {
            postmodule.delete(idpost)
              .then(data => {
                res.send('post deleted');
              });
          }
          else {
            res.send('you connot delete');
          }
        });
    });
}

function chatHandler(req, res) {

}

function otherUserProfileHandler(req, res) {
  req.user.capabilities = ['READ', 'ADD REVIEW'];
  let username = req.params.username;
  // console.log(username);
  User.read(username)
    .then(otherUser => {
      if (otherUser.user_name !== req.user.user_name) {
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

function addArticleUser(req, res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.articleByUser(id1, id2)
    .then(data => {
      res.redirect('/profile');
    });

}
function readOne(req, res) {
  let userName = req.user.user_name;
  User.read(userName)
    .then(data => {
      res.json(data);
    });
}

function deleteArticles(req, res) {
  let id1 = req.user.user_name;
  let id2 = req.params.idarticle;
  User.deleteArticle(id1, id2)
    .then(data => {
      res.redirect('/profile');
    });
}

module.exports = router;
