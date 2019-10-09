// Types for handlers
import { RequestHandler } from "express";
import { TAuthenticatedReqHandler } from "./types";
import { IMessage } from "../models/types";

// Util to make custom errors for any db operation that fails
import { throwErr } from "./error";

// Get Mongoose models
import Message from "../models/message";

// Send all existing messages as JSON.  Note that author data is partially
// populated in this response.
export const respondWithMessages: TAuthenticatedReqHandler = async (
    req,
    res,
    next
) => {
    const messages = await Message.find()
        .populate("author", "createdAt updatedAt displayName photos")
        .exec();

    res.json(messages);
};

// Create a new message and respond with the created message.
export const createMessage: TAuthenticatedReqHandler = async (
    req,
    res,
    next
) => {
    const { text } = req.body;

    const newMessage = await Message.create({ text, author: req.user._id });

    /*client store depends on newly-created document's 'author' field being populated.
    Mongoose's Document#populate is undocumented in TypeScript (it seems)--so we'll
    use Model#populate for now.
    */
    const populatedNewMessage = await Message.populate(newMessage, {
        path: "author",
        select: "createdAt updatedAt displayName photos"
    });

    console.log(populatedNewMessage);

    res.json(populatedNewMessage);
};

// delete a message.
export const deleteMessage: TAuthenticatedReqHandler = async (
    req,
    res,
    next
) => {
    const messageToDelete = await Message.findById(req.params.id).exec();

    if (messageToDelete === null) {
        throwErr("Document for deletion not found", 500);
    } else if (!messageToDelete.isAuthorizedRequest(req)) {
        throwErr("FORBIDDEN", 403);
    } else {
        await messageToDelete.remove();
        res.status(204).send();
    }
};
