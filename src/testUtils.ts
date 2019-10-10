import faker from "faker";

import mongoose, { Model, ConnectionOptions } from "mongoose";
import { ObjectId } from "bson";

// Get schemas/types for mock data
import { userSchema } from "./models/user";
import { messageSchema } from "./models/message";
import { IUser, IMessage } from "./models/types";

const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;

mongoose.connect(
    `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
);

// type for config options to controller.  For now, these are only connection parameters.
interface IConfig {
    uri: string;
    password?: string;
    username?: string;
    connectionOptions: ConnectionOptions;
}

export class testDBController {
    private _messages: Array<IMessage>;
    private _users: Array<IUser>;
    public _Message: Model<IMessage>;
    public _User: Model<IUser>;

    constructor() {
        this._messages = [];

        this._users = [];

        this._Message = mongoose.model("Message", messageSchema);

        this._User = mongoose.model("User", userSchema);
    }

    get messages(): Array<IMessage> {
        return this._messages;
    }

    get users(): Array<IUser> {
        return this._users;
    }

    private randomProvider(): string {
        const providers = ["facebook", "google"];

        return providers[Math.round(Math.random())];
    }

    private genFakeUser(): IUser {
        const fakeUserNode = {
            displayName: faker.internet.userName(),

            name: {
                givenName: faker.name.firstName(),
                familyName: faker.name.lastName()
            },

            provider: this.randomProvider(),

            emails: [{ value: faker.internet.email() }],

            photos: [{ value: faker.image.image() }],

            messages: [],

            following: [mongoose.Types.ObjectId()]
        };

        return new this._User(fakeUserNode);
    }

    // Method to populate collection w/ specified number of
    // User documents that conform to standard data shape
    public genMockUsers(userCount: number) {
        if (userCount <= 0) {
            throw new Error(
                "Invalid argument passed to genFake Users: please enter number greater than 0"
            );
        }

        let remaining = userCount;

        while (remaining > 0) {
            // add generated document to local property.
            this._users.push(this.genFakeUser());

            remaining--;
        }

        return this;
    }

    public selectUser(): IUser {
        const randIndex = Math.floor(Math.random() * this._users.length);
        return this._users[randIndex];
    }

    private genFakeMessage(): IMessage {
        const author = this.selectUser()._id;

        const fakeMessageNode = {
            text: faker.lorem.sentence(10),
            author
        };

        return new this._Message(fakeMessageNode);
    }

    public genMockMessages(messageCount: number) {
        if (!this._users.length) {
            throw new Error(
                "genMockUsers must be called before generating fake messages!"
            );
        }

        let remaining = messageCount;

        while (remaining > 0) {
            const newMessage = this.genFakeMessage();

            this._messages.push(newMessage);

            remaining--;
        }
        // return await Promise.all(this._messages.map(msg => msg.save())).catch(err=> this.handleError(err));
        return this;
    }

    public async saveData() {
        let users = (await Promise.all(
            this._users.map((usr) => usr.save())
        ).catch((e) => this.handleError(e))) as Array<IUser>;

        this._users = <any>users;

        const messages = await Promise.all(
            this._messages.map((msg) => msg.save())
        ).catch((e) => this.handleError(e));

        this._messages = <any>messages;
        return this;
    }

    public async clear() {
        this._users = [];
        this._messages = [];
        await this._User.deleteMany({});
        await this._Message.deleteMany({});
        return this;
    }

    public closeConnection() {
        return mongoose.connection.close();
    }

    // Test whether a given JSON string is a representation of saved data
    public isSimilarArray(
        saved: Array<IUser | IMessage>,
        json: string
    ): boolean {
        const nativeArray = JSON.parse(json);

        nativeArray.includesObject = function(savedObj: IUser | IMessage) {
            let includes: boolean = false;
            this.forEach((obj: IUser | IMessage) => {
                if (obj._id === savedObj._id) {
                    includes = true;
                }
            });
            return includes;
        };

        let isSimilar = true;

        saved.forEach((obj) => {
            if (!nativeArray.includesObject(obj)) {
                isSimilar = false;
            }
        });

        return isSimilar && saved.length === nativeArray.length;
    }

    private handleError(err: Error) {
        console.error(err);
    }
}
