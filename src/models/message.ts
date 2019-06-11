import mongoose, { Schema, Model } from 'mongoose';

// Get needed types
import {IMessage} from './types';

// Get User model for save hook
import User from './user';

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

        // typeguard
        if(authorDoc === null) {throw new Error('Invalid User')};

        // Add id of new message to author's list of messages
        authorDoc.messages.push(_id);

        await authorDoc.save();
    }
   
    catch(e) {
        // TODO: Better err handling
    }
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
