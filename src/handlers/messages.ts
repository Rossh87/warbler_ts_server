// Type for handler
import { RequestHandler } from "express";

// Util to make custom errors for any db operation that fails
import { validateOrThrow, throwErr } from "./error";

// Get Mongoose models
import Message from "../models/message";

// Send all existing messages as JSON.  Note that author data is partially
// populated in this response.
export const respondWithMessages: RequestHandler = async (req, res, next) => {
    const validator = validateOrThrow(
        (r) => r !== null && r.length,
        "No messages found",
        404
    );

    const messages = await validator(
        Message.find()
            .populate("author", "createdAt updatedAt displayName photos")
            .exec()
    );

    res.json(messages);
};

// Create a new message and respond with the created message.
export const createMessage: RequestHandler = async (req, res, next) => {
    const validator = validateOrThrow((r) => r, "Creation failed", 500);
    const { text } = req.body;

    const newMessage = await validator(
        Message.create({ text, author: req.user._id })
    );

    res.json(newMessage);
};

// delete a message.
export const deleteMessage: RequestHandler = async (req, res, next) => {
    const validator = validateOrThrow(
        (r) => r,
        "Resource for deletion not found",
        404
    );

    const messageToDelete = await validator(
        Message.findById(req.params.id).exec()
    );

    if (!messageToDelete.isAuthorizedRequest(req)) {
        throwErr("FORBIDDEN", 403);
    } else {
        await messageToDelete.remove();
        res.status(204).send();
    }
};
