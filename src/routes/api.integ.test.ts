import express, { Express } from "express";
import apiRoutes from "./api";
import mongoose from "mongoose";

// Get error handler for test 'server'
import { handleErrors } from "../handlers/error";

// Get integration testing utils
import request from "supertest";
import { testDBController as tdb } from "../testUtils";
import bodyParser from "body-parser";

// Get type for user prop on req
import { IUser, IMessage } from "../models/types";

const testDB = new tdb();

let app: Express = express();
let currUser: IUser;

async function setup(
    config: {
        users?: number;
        messages?: number;
    } = {}
): Promise<[Array<IUser>, Array<IMessage>]> {
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

app.use(handleErrors);

beforeEach(async () => {
    // Reset test database
    return await testDB.clear();
});

afterAll(async () => {
    // Close connection to db so jest can terminate
    return await testDB.closeConnection();
});

describe("the api routes", () => {
    it("responds to GET /user with json of user object", async () => {
        await setup();

        const response = await request(app).get("/user");

        expect(response.text).toEqual(JSON.stringify(currUser));
    });

    it("responds to GET /sessionStatus with json of session status", async () => {
        await setup();

        const response = await request(app).get("/sessionStatus");

        const result = JSON.parse(response.text);

        expect(result).toEqual({ sessionIsActive: true });
    });

    it('responds to GET "/messages" with populated messages from db', async () => {
        await setup();

        const response = await request(app).get("/messages");

        // Query db directly here to make sure response and expected are in same order--
        // there's no simple way to compare arrays with same contents in
        // different order
        const expected = await testDB._Message
            .find()
            .populate("author", "createdAt updatedAt displayName photos")
            .exec();

        expect(response.text).toEqual(JSON.stringify(expected));
    });

    it('responds to POST "/messages/" by creating new db entry for user and replies w/ new entry ', async () => {
        const [users, messages] = await setup();

        const response = await request(app)
            .post("/messages")
            .send({ text: "test text" });

        const resText = JSON.parse(response.text);

        const dbMessages = await testDB._Message.find();

        expect(resText.text).toEqual("test text");

        // ensure correct properties are populated on 'author' field of new message in response
        expect(resText.author).toEqual(
            expect.objectContaining({
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                displayName: expect.any(String),
                photos: expect.arrayContaining([
                    { value: expect.any(String), _id: expect.any(String) }
                ])
            })
        );

        // ensure there is an extra Message doc in db
        expect(dbMessages.length).toEqual(messages.length + 1);
    });

    it('responds to DELETE "/messages/:id" by deleting the message in URI and triggers remove middleware', async () => {
        const [users, messages] = await setup();
        const messageToDelete = messages[0];

        currUser = (await testDB._User.findById(messages[0].author)) as IUser;

        const response = await request(app).delete(
            `/messages/${messageToDelete._id}`
        );

        // ensure deleted msg is gone from db;
        const updatedMessages = await testDB._Message.find();
        expect(updatedMessages.length).toEqual(messages.length - 1);

        // ensure deleted msg is gone from author's associated messages
        const authorOfDeleted = await testDB._User.findById(
            messageToDelete.author
        );
        if (!authorOfDeleted) {
            throw "no author found";
        }

        expect(
            authorOfDeleted.messages.some(
                (msgID) => msgID === messageToDelete._id
            )
        ).toEqual(false);
    });

    it("throws on unauthorized delete request", async () => {
        const [users, messages] = await setup();

        const messageToDelete = messages[0];

        // simulate request from authenticated user who is
        // not the author of messageToDelete
        currUser._id = mongoose.Types.ObjectId();

        const res = await request(app).delete(
            `/messages/${messageToDelete._id}`
        );

        expect(res.status).toBe(403);
    });

    it('responds to POST "/user/following" by adding another user to list of followed and sending updated user', async () => {
        await setup();

        const newFollowingId = mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .post("/user/following")
            .send({ follow: newFollowingId });

        const resText = JSON.parse(response.text);

        const expected = [...currUser.getFollowingStrings(), newFollowingId];

        expect(resText.following).toEqual(expected);
    });

    it('responds to PATCH "/user/following" by removing specified user id from list of followed and sending updated user', async () => {
        await setup();

        const userToUnfollow = currUser.getFollowingStrings()[0];

        const response = await request(app)
            .patch("/user/following")
            .send({ unfollow: userToUnfollow });

        const resText = JSON.parse(response.text);

        const expected = currUser
            .getFollowingStrings()
            .filter((idString) => idString !== userToUnfollow);

        expect(resText.following).toEqual(expected);
    });
});
