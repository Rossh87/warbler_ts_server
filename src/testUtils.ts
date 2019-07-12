import faker from 'faker';

import mongoose, {Model, ConnectionOptions, Connection} from 'mongoose';

// Get schemas/types for mock data
import {userSchema} from './models/user';
import {messageSchema} from './models/message';
import {IUser, IMessage, TLeanMessage, TLeanUser} from './models/types';
import { worker } from 'cluster';


// create a custom connection to test DB.  We will connect our document schemas
// through this connection and add the resulting models as static methods to the 
// controller class.
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;
// const testDBConnection = mongoose.createConnection(
//     `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`,
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true
//     },
// )

mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`,
{
    useNewUrlParser: true,
    useCreateIndex: true
},)

// type for config options to controller.  For now, these are only connection parameters.
interface IConfig {
    uri: string,
    password?: string,
    username?: string,
    connectionOptions: ConnectionOptions,
}

export class testDBController {
    private _messages: Array<IMessage>;
    private _users: Array<IUser>;
    private _Message: Model<IMessage>;
    private _User: Model<IUser>;
    public currentUser: IUser | null;

    constructor() {

        this._messages = [];

        this._users = [];

        this._Message = mongoose.model('Message', messageSchema);

        this._User = mongoose.model('User', userSchema);

        this.currentUser = null;
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

        return new this._User(fakeUserNode);
    }

    // Method to populate collection w/ specified number of
    // User documents that conform to standard data shape
    public genMockUsers(userCount: number) {
        if(userCount <= 0) {
            throw new Error('Invalid argument passed to genFake Users: please enter number greater than 0');
        };

        let remaining = userCount;

        while(remaining > 0) {
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
        if(!this._users.length) {
            throw new Error('genMockUsers must be called before generating fake messages!');
        };

        const author =
            this.selectUser()._id

        const fakeMessageNode = {
            text: faker.lorem.sentence(10),
            author
        }

        return new this._Message(fakeMessageNode);
    }

    public genMockMessages(messageCount: number) {
        let remaining = messageCount;

        while(remaining > 0) {
            const newMessage = this.genFakeMessage();

            this._messages.push(newMessage);
            
            remaining--;
        }
        // return await Promise.all(this._messages.map(msg => msg.save())).catch(err=> this.handleError(err));
        return this;
    }

    public async saveData() {
        const users = await Promise.all(this._users.map(usr => usr.save())).catch(e => this.handleError(e));
        this._users = <any>users;
        const messages = await Promise.all(this._messages.map(msg => msg.save())).catch(e => this.handleError(e));
        this._messages = <any>messages
        return this;
    }

    public async clear() {
        this._users = [];
        this._messages = [];
        await this._User.collection.drop();
        await this._Message.collection.drop();
    }

    public closeConnection() {
        return mongoose.connection.close();
    }

    private handleError(err: Error) {
        console.error(err);
    }
}
