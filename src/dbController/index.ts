// Get Mongoose models
import User from '../models/user';
import Message from '../models/message';

// Get types
import {IUser, IMessage} from '../models/types';
import { tsNumberKeyword } from '@babel/types';

// Get all msgs from db and return them
export const getMessages = async (): Promise<IMessage []> => {
    return await Message.find();
};

// Get all messages with their 'author' property populated with a user object,
// and pruned for convenience/efficiency
export const getPopulatedMessages = async (): Promise<IMessage []> => {
    const messages = await getMessages();
    
    const populatedMsgs = await Promise.all<IMessage>(messages.map((msg) => {
        return msg.populate('author', 'createdAt updatedAt displayName photos').execPopulate();
    }));

    return populatedMsgs;
};

// Creates a new msg and returns it.  Note that pre-save hook in Message model
// updates the User document that corresponds to the message's author.  If an invalid
// id is passed to createMessage, the pre-save hook will throw, preventing the creation of
// a new message document.
export const createMessage = async (text: string, author: string): Promise<IMessage> => {
    if(!text || !author) {
        throw new Error('Text and Author information required to create new message');
    }
    
    const newMessage = await Message.create({text, author});
    return newMessage;
};

// Not currently used, may be useful later.  Lookup and return any user document
// By _id.
export const getUser = async (_id: string): Promise<IUser | null> => {
    const user = await User.findById(_id);
    return user;
};