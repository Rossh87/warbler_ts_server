import faker from 'faker';

import mongoose, {Model, ConnectionOptions, Connection} from 'mongoose';

// Get schemas/types for mock data
import {userSchema} from './models/user';
import {messageSchema} from './models/message';
import {IUser, IMessage} from './models/types';

// create a custom connection to test DB.  We will connect our document schemas
// through this connection and add the resulting models as static methods to the 
// controller class.
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;
const testDBConnection = mongoose.createConnection(
    `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    },
)

// type for config options to controller.  For now, these are only connection parameters.
interface IConfig {
    uri: string,
    password?: string,
    username?: string,
    connectionOptions: ConnectionOptions
}

export class testDBController {
    private _messages: Array<IMessage>;
    private _users: Array<IUser>;
    private _Message: Model<IMessage>;
    private _User: Model<IUser>;
    private _connection: Connection;

    constructor(config: IConfig) {
        this._connection = mongoose.createConnection(
            config.uri,
            config.connectionOptions
        );

        this._messages = [];

        this._users = [];

        this._Message = testDBConnection.model('Message', messageSchema);

        this._User = testDBConnection.model('User', userSchema);
    }

    get messages() {
        return this._messages;
    }

    get users() {
        return this._users;
    }

    private randomProvider(): string {
        const providers = ['facebook', 'google'];
    
        return providers[Math.round(Math.random())]
    };

    private genFakeUser() {
        // Get mongoose model connected to test database
        const User = this._User;

        const fakeUserNode = {    
            displayName: faker.internet.userName(),
    
            name: {
                givenName: faker.name.firstName(),
                familyName: faker.name.lastName()
            },
        
            provider: this.randomProvider(),
                    
            emails: [{value: faker.internet.email()}],
    
            photos: [{value: faker.image.image()}],

            messages: []
        };

        return new User(fakeUserNode);
    }

    // Method to populate collection w/ specified number of
    // User documents that conform to standard data shape
    public saveMockUsers(userCount: number) {
        if(userCount <= 0) {
            throw new Error('Invalid argument passed to genFake Users: please enter number greater than 0');
        };

        let remaining = userCount;

        while(remaining > 0) {
            // Add generated document to local property before saving.  This way we 
            // can access/assert on documents in tests w/out querying the database for them.
            // This is convenient because the data is random--we cannot know what data running these methods
            // will generate, so we need a reliable reference to the generated data.
            this._users.push(this.genFakeUser());

            remaining--;
        }

        // Saving docs is async, so we wait for all promises from calling 'save'
        // to fulfill.  If any fails, the catch block will be invoked w/ the reason.
        return Promise.all(this._users.map(user => user.save())).catch(this.handleError);
    }

    public clear() {
        this._users = [];
        this._connection.dropCollection('users').catch(this.handleError);
    }

    private handleError(err: Error) {
        console.error(err);
    }
}
