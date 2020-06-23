'use strict';
const users = require('../src/users');
const userModel = require('../model/user-model');
const superagent = require('superagent');
require('dotenv').config();
const axios = require('axios').default;


const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER; //local
const REDIRECT_URI = process.env.REDIRECT_URI;

module.exports = async function authorize(req, res, next) {

  try {
    let code = req.query.code;
    let remoteToken = await exchangeCodeForToken(code);
    let remoteUser = await getFacebookUserData(remoteToken);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;

    next();
  } catch (e) { next(`ERROR: ${e.message}`); }

};

async function exchangeCodeForToken(code) {


  let tokenResponse = await superagent.post(API_SERVER).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  }).catch(e => console.log(e.message));

  let access_token = tokenResponse.body.access_token;
  console.log(access_token);

  return access_token;

}

// axios  send asynchronous HTTP request to REST endpoints and perform CRUD operations, (do superagent work with different features)
async function getFacebookUserData(access_token) {
  const { data } = await axios({
    url: remoteAPI,
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','), // the data we request from FB API.
      access_token: access_token,
    },
  });

  return data;
}

async function getUser(remoteUser) {
  let userRecord = {
    user_name: `${remoteUser.first_name} ${remoteUser.last_name}`,
    email: remoteUser.email,
    password: 'oauthpassword',
    role: 'ventor',
  };

  let user = await users.saveHash(userRecord);
  let token = users.getToken(user);
  console.log(user);
  await userModel.create(user);

  return [user, token];

}