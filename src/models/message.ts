import mongoose, { Schema, Document} from 'mongoose';

// Bring in User model to update its 'messages' field
// whenever a message is saved to a given author
import User, {IUser} from './user';

// Type interface for Message document created from model below.
// Note the union type allowing for the 'author' field to be populated with user data.
// Timestamp properties are generated by Mongo, but we have to indicate that manually here.

export type TPopulatedAuthor = Pick<IUser, 'photos' | 'displayName' | 'createdAt' | 'updatedAt'>

export interface IMessage extends Document {
    text: string,
    author: string | TPopulatedAuthor,
    createdAt: string,
    updatedAt: string
};

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Before saving a new message, update the message
// author to reflect the creation of a new message belonging
// to them.
messageSchema.pre<IMessage>('save', async function() {
    // In Mongoose document middleware, keyword 'this' refers to the document 
    // being operated on.
    const {author, _id} = this;

    try {
        const authorDoc = await User.findById(author);

        if(authorDoc === null) {throw new Error('Invalid User')};

        // Add id of new message to author's list of messages
        authorDoc.messages.push(_id);

        authorDoc.save();
    }
   
    catch(e) {
        
    }
});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
