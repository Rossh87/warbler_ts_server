import mongoose, { Schema } from 'mongoose';

export interface IMessage {
    text: string,
    author: string
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

const Message = mongoose.model('Message', messageSchema);
export default Message;
