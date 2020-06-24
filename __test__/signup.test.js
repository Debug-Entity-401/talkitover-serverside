'use strict';

const { server } = require('../lib/server');
const supergose = require('@code-fellows/supergoose');
const users = require('../src/users');
const mockRequest = supergose(server);

let data = { 'user_name': 'ammart', 'password': '199483', 'role': 'ventor', 'email': 'Ammar@hariry.com' };
describe('Routs Error', () => {
  let token = null;
  it('POST to /signup to create a new user', () => {
    return mockRequest.post('/signup')
      .send(data)
      .then(results => {
        token = users.getToken(data);
      });
  });
  it('POST to /signup to response status error: 403 is already signed up with the same username', () => {

    return mockRequest.post('/signup')
      .send(data)
      .then(results => {
        expect(results.status).toBe(403);
      });
  });

  it('POST to /signup to response status error: 403 if user doesn\'t enter the required data', () => {
    let data = { 'user_name': 'ammart', 'password': '199483', 'role': 'ventor' };
    return mockRequest.post('/signup')
      .send(data)
      .then(results => {
        expect(results.status).toBe(403);
      });
  });

});