'use strict';

const users = require('../src/users');
const superagent = require('superagent');
const signUp = require('../model/user-model');
require('dotenv').config();

const CLIENT_ID = '58873f3b284a8f3adc6e';
const CLIENT_SECRET = '5fd24e0c1639b375c2b4e379f1aa81646f8fa23e';
const remoteUserApi = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3031/oauth';

const apiTokenUri = 'https://github.com/login/oauth/access_token';

module.exports = async function authorize(req, res, next) {

    try {
        let code = req.query.code;
        console.log('(1) CODE:', code);

        let remoteToken = await exchangeCodeForToken(code);
        console.log('(2) ACCESS TOKEN:', remoteToken);

        let remoteUser = await getRemoteUserInfo(remoteToken);
        console.log('(3) GITHUB USER', remoteUser);

        let [user, token] = await getUser(remoteUser);
        req.user = user;
        req.token = token;
        console.log('(4) LOCAL USER', user);

        next();
    } catch (e) { next(`ERROR: ${e.message}`) }

};

async function exchangeCodeForToken(code) {
    // console.log(CLIENT_ID);
    // console.log(CLIENT_SECRET);



    let tokenResponse = await superagent.post('https://developer19.us.auth0.com/oauth/token').send({
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: 'http://localhost:3031/oauth',
        grant_type: 'authorization_code',
    }).catch(e => console.log(e.message));



    console.log(tokenResponse);

    let access_token = tokenResponse.body.access_token;

    return access_token;

}

async function getRemoteUserInfo(token) {
    // console.log(token);
    let userResponse =
        await superagent.get('https://developer19.us.auth0.com/userinfo')
        .set('user-agent', 'express-app')
        .set('Authorization', `Bearer ${token}`)
    let user = userResponse.body;
    // console.log('user res',user);

    return user;

}

async function getUser(remoteUser) {
    let userRecord = {
        username: remoteUser.login,
        password: 'oauthpassword';
    }

    let user = await users.save(userRecord);
    let token = users.generateToken(user);
    console.log('thisss==+++++++>', token);

    return [user, token];

}
