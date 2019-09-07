import mongoose, { Schema, Model } from "mongoose";

// Get needed types
import { IMessage } from "./types";
import { Request } from "express";

// Get User model for save hook
import User from "./user";
import { CustomError } from "../handlers/types";

export const messageSchema = new mongoose.Schema<IMessage>(
    {
        text: {
            type: String,
            required: true
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Before saving a new message, update the message
// author to reflect the creation of a new message belonging
// to them.
messageSchema.pre<IMessage>("save", async function() {
    // In Mongoose document middleware, keyword 'this' refers to the document
    // being operated on.

    const { author, _id } = this;

    const authorDoc = await User.findById(author).exec();

    if (!authorDoc) {
        throw new CustomError("Message pre-save failed: author not found", 500);
    }

    // Add id of new message to author's list of messages
    authorDoc.messages.push(_id);

    await authorDoc.save();
});

// Before a message is deleted, remove the message from the
// author's list of associated messages
messageSchema.pre<IMessage>("remove", async function() {
    const { author, _id } = this;

    const authorDoc = await User.findById(author).exec();

    if (!authorDoc) {
        throw new CustomError(
            "Message pre-remove failed: author not found",
            500
        );
    }
    authorDoc.messages = authorDoc.messages.filter(
        (msgID: string) => msgID !== _id
    );

    await authorDoc.save();
});

// Message document should have a method to ensure that a given Express
// request is authorized to modify it.  Note the call to 'toString' to enable
// comparison--these properties are actually objects in the Mongoose document.
messageSchema.methods.isAuthorizedRequest = function(req: Request): boolean {
    return this.author.toString() === req.user._id.toString();
};

const Message: Model<IMessage> = mongoose.model<IMessage>(
    "Message",
    messageSchema
);

export default Message;
