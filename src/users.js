'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userread = require('../model/user-model');

const SECRET = process.env.SECRET;

let role = {
  Regular_users: ['READ'],
  Writers: ['READ', 'CREATE'],
  Editors: ['READ', 'CREATE', 'UPDATE'],
  Administrators: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
};
let users = {};

users.saveHash = async function(record) {
  let dataRexord = await userread.read(record.user_name);

  if (!dataRexord || !dataRexord[0]) {
    record.password = await bcrypt.hash(record.password, 5);

    return record;
  } else {
    console.error('it is already exists');
    return dataRexord;

  }
};
users.authenticateBasic = async function(user, pass) {
  console.log('user   ===',user);
  console.log('passs    ',pass);
  const dataRexord = await userread.read(user);
  console.log('dataa   ======',dataRexord);
  let valid = await bcrypt.compare(pass, dataRexord.password);
  console.log('valid   ',valid);
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
    let dataRexord = await userread.read(username);
    if (dataRexord) {
      return Promise.resolve(decoded);
    }
    return Promise.reject();
  });

};

module.exports = users;
