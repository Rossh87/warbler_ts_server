import { RequestHandler } from "express";

// Get Mongoose models
import Message from "../models/message";

// Send all existing messages as JSON.  Note that author data is partially
// populated in this response.
export const respondWithMessages: RequestHandler = async (req, res, next) => {
  const messages = await Message.find()
    .populate("author", "createdAt updatedAt displayName photos")
    .exec();

  res.json(messages);
};

// Create a new message and respond with the created message.
export const createMessage: RequestHandler = async (req, res, next) => {
  const { text } = req.body;

  const newMessage = await Message.create({ text, author: req.user._id });

  res.json(newMessage);
};

// delete a message.
export const deleteMessage: RequestHandler = async (req, res, next) => {
  const messageToDelete = await Message.findById(req.params.id);

  if (!messageToDelete) {
    throw new Error("Message not found");
  } else if (!messageToDelete.isAuthorizedRequest(req)) {
    throw new Error("Unauthorized request");
  } else {
    await messageToDelete.remove();
    res.status(204).send();
  }
};
