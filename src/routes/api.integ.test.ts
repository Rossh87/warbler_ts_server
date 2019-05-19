// Integration testing seems like the most economical way to 
// test routes, data schemas, and db queries all at the same time.
// Some unit tests for routes involving complex logic will likely be appropriate
// as well.
import express from 'express';
import apiRoutes from './api';

// Get integration testing util
import request from 'supertest';

// Bring in db.  Will automatically connect to test DB when tests run
import '../database';

// Get type for user prop on req
import { IUser } from '../models/user';

const app = express();

// Add a middleware to populate the user property on the 
// request object.  In the live app, this is handled by authorization logic
// (i.e. passport.serialize/deserialize), but that doesn't need to be tested here.
const mockUser: IUser = {
    displayName: 'some name',
    name: {
        familyName: 'hunter',
        givenName: 'ross'
    },
    photos: [{
        value: 'http://url/to/photo.com'
    }],
    emails: [{
        value: 'email@mail.com'
    }],
    provider: 'facebook',
};

app.use((req, res, next) => {
    req.user = mockUser;

    next();
});

app.use('/api', apiRoutes);

describe('api route handlers', () => {
    it('responds with json of user object', async () => {
        const response = await request(app).get('/api/user');

        expect(response.text).toEqual(JSON.stringify(mockUser))
    })
})