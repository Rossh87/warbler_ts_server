import express, {Express} from 'express';
import apiRoutes from './api';

// Get integration testing utils
import request from 'supertest';
import {testDBController as tdb} from '../testUtils';
import bodyParser from 'body-parser';

// Get type for user prop on req
import { IUser } from '../models/types';

// Get Document type to diff the user type
import {Document} from 'mongoose';
import {TDiffTypeProps} from '../declarations/utilityTypes';

const testDB = new tdb();

let app: Express;
let currUser: IUser;

beforeEach(async() => {
    app = express();

    // Reset test database
    await testDB.clear();

    // Add fresh data to db
    await testDB.genMockUsers(2).genMockMessages(2).saveData()

    currUser = testDB.selectUser();

    // Add a middleware to populate the 'user' property on the
    // 'request' object, simulating an authenticated request.
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        req.user = currUser;

        next();
    });

    app.use(apiRoutes);
});

afterAll(async () => {
    return await testDB.closeConnection();
})

describe('the api routes', () => {
    it('responds to GET /user with json of user object', async () => {
        const response = await request(app).get('/user');

        expect(response.text).toEqual(JSON.stringify(currUser))
    });

    it('responds to GET "/messages" with populated messages from db', async() => {
        const response = await request(app).get('/messages');

        // Query db directly here to make sure response and expected are in same order--
        // there's currently no simple way to compare arrays with same contents in 
        // different order
        const expected = await testDB._Message.find().populate('author', 'createdAt updatedAt displayName photos').exec();

        expect(response.text).toEqual(JSON.stringify(expected))
    });

    it('responds to POST "/messages/create" by creating new db entry for user and replies w/ new entry ', async () => {
        const response = await request(app)
            .post('/messages/create')
            .send({text: 'test text'});

        const resText = JSON.parse(response.text);

        const dbMessages = await testDB._Message.find();

        expect(resText.text).toEqual('test text');
        expect(resText.author).toEqual(currUser._id.toString());

        // ensure there is an extra Message doc in db
        expect(dbMessages.length).toEqual(testDB.messages.length + 1);
    })
});

