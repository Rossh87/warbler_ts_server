import express, {Express} from 'express';
import apiRoutes from './api';

// Get integration testing utils
import request from 'supertest';
import {testDBController as tdb} from '../testUtils';
import bodyParser from 'body-parser';

// Get type for user prop on req
import { IUser } from '../models/types';

const testDB = new tdb();

let app: Express = express();
let currUser: IUser;

async function setup(config: {users?: number, messages?: number} = {}) {
    await testDB
        .genMockUsers(config.users || 2)
        .genMockMessages(config.messages || 5)
        .saveData();

    currUser = testDB.selectUser();
    
    return [testDB.users, testDB.messages];
}

app.use(bodyParser.json());

app.use((req, res, next) => {
    req.user = currUser;

    next();
});

app.use(apiRoutes);


beforeEach(async() => {
    // Reset test database
    await testDB.clear();
});

afterAll(async () => {
    // Close connection to db so jest can terminate
    return await testDB.closeConnection();
})

describe('the api routes', () => {
    it('responds to GET /user with json of user object', async () => {
        await setup();

        const response = await request(app).get('/user');

        expect(response.text).toEqual(JSON.stringify(currUser))
    });

    it('responds to GET "/messages" with populated messages from db', async() => {
        await setup();

        const response = await request(app).get('/messages');

        // Query db directly here to make sure response and expected are in same order--
        // there's no simple way to compare arrays with same contents in 
        // different order
        const expected = await testDB._Message.find().populate('author', 'createdAt updatedAt displayName photos').exec();

        expect(response.text).toEqual(JSON.stringify(expected))
    });

    it('responds to POST "/messages/create" by creating new db entry for user and replies w/ new entry ', async () => {
        const [users, messages] = await setup();

        const response = await request(app)
            .post('/messages/create')
            .send({text: 'test text'});

        const resText = JSON.parse(response.text);

        const dbMessages = await testDB._Message.find();

        expect(resText.text).toEqual('test text');
        expect(resText.author).toEqual(currUser._id.toString());

        // ensure there is an extra Message doc in db
        expect(dbMessages.length).toEqual(messages.length + 1);
    })
});

