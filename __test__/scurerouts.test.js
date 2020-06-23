'use strict';

const { server } = require('../lib/server');
const supergose = require('@code-fellows/supergoose');
const mockRequest = supergose(server);

let data = { 'user_name': 'ammart', 'password': '199483', 'role': 'WRITER', 'email': 'Ammar@hariry.com' };
describe('Routs Error', () => {

    it('POST to /signinto response status success : 201', () => {
        return mockRequest.post('/signin')
            .send({
                user_name: 'ammart5',
                password: '199483',
            })
            .then(results => {
                expect(results.status).toBe(500);
            });
    });
    it('POST to /invalidrout to response status error: 404', () => {

        return mockRequest.post('/invalidrout')
            .send(data)
            .then(results => {
                expect(results.status).toBe(404);
            });
    });
    it('get to / to response status sucess : 200', () => {

        return mockRequest.get('/')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

});

describe('These Routs Be Accessed While The user Sign In', () => {
    it('It /profile to response status error: 500', () => {
        return mockRequest
            .get('/profile')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /home to response status error: 500', () => {
        return mockRequest
            .get('/home')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /user-articles to response status error: 500', () => {

        return mockRequest
            .get('/user-articles')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /talkitoverposts to response status error: 500', () => {
        return mockRequest
            .get('/talkitoverposts')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /chatroom to response status error: 500', () => {
        return mockRequest
            .get('/chatroom')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /addreview/username to response status error: 500', () => {
        return mockRequest
            .post('/addreview/username')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
    it('It /deletereview/username/id to response status error: 500', () => {
        return mockRequest
            .delete('/deletereview/username/id')
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });

});