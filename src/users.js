'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userread = require('../model/user-model');
require('dotenv').config();

const SECRET = process.env.SECRET;

let role = {
  Regular_users: ['READ'],
  Writers: ['READ', 'CREATE'],
  Editors: ['READ', 'CREATE', 'UPDATE'],
  Administrators: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
};

let users = {};

users.saveHash = async function(record) {
  let dataRecord = await userread.read(record.user_name);
  if (!dataRecord[0]) {
    record.password = await bcrypt.hash(record.password, 5);
    return record;
  } else {
    console.error('it is already exists');
    return dataRecord;
  }
};
users.authenticateBasic = async function(user, pass) {
  const dataRexord = await userread.read(user);
  let valid = await bcrypt.compare(pass, dataRexord[0].password);
  return valid ? dataRexord : Promise.reject();
};

users.getToken = function(user) {
  let token = jwt.sign({ user_name: user.user_name, capabilities: role[user.role] }, SECRET);
  return token;

};

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
