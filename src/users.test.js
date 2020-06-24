'use strict';

require('@code-fellows/supergoose');
const users = require('../src/users');
const userModel = require('../model/user-model');

let data = { 'user_name': 'ammart', 'password': '199483', 'role': 'venter', 'email': 'Ammar@hariry.com' };

describe('user auth', () => {
  it('savehash() will save the user name and hashed password', () => {
    return userModel.create(data)
      .then(record => {
        users.saveHash(record).then(hashed => {
          expect(hashed.user_name).toEqual(data.user_name);
        });
      });
  });
  it('authenticateBasic() will return true if the username and the password are valid', () => {
    users.authenticateBasic('ammart', '199483')
      .then(hashed => {
        expect(hashed).toBeTruthy();
      });
  });
  it('authenticateBasic() will return true if the username and the password are invalid', () => {
    users.authenticateBasic('notsignup', '2020')
      .then(hashed => {
        expect(hashed).toBeFalsy();
      });
  });
});