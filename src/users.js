'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userread = require('../model/user-model');


const SECRET = process.env.SECRET;

let role = {
  Regular_users: ['READ'],
  Listener: ['READ', 'CREATE'],
  ventor: ['READ', 'CREATE', 'POST'],
  Editors: ['READ', 'CREATE', 'UPDATE'],
  Administrators: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'DELETE REVIEW'],
};

let users = {};

/**
 * 
 * @param {Object} record 
 * it will encrypt for te user password
 */
users.saveHash = async function(record) {
  let dataRexord = await userread.readUser(record.user_name);
  if (!dataRexord[0]) {
    record.password = await bcrypt.hash(record.password, 5);
    return record;
  } else {
    console.error('it is already exists');
    return dataRexord;

  }
};
/**
 * 
 * @param {string} user 
 * @param {string} pass
 * it will compare the user  hashd password that exist the with the inserted password
 */
users.authenticateBasic = async function(user, pass) {
  const dataRexord = await userread.readUser(user);
  let valid = await bcrypt.compare(pass, dataRexord.password);
  return valid ? dataRexord : Promise.reject();
};
/**
 * 
 * @param {Object} user
 * it will genrate a user token from jwt  
 */
users.getToken = function(user) {
  let token = jwt.sign({ user_name: user.user_name, capabilities: role[user.role],role: user.role }, SECRET);
  return token;

};

/**
 * 
 * @param {string} token
 *  it will virify the user token belong to this user
 */
users.verifyToken = async function(token) {

  return jwt.verify(token, SECRET, async function(err, decoded) {
    if (err) {
      console.log('Error :INVALID SECRET OR TOKEN ');
      return Promise.reject(err);
    }
    let username = decoded.user_name;
    let dataRecord = await userread.read(username);
    if (dataRecord) {
      return Promise.resolve(decoded);
    }
    return Promise.reject();
  });

};

module.exports = users;