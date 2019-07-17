// Get needed types
import {AuthenticatedReqHandler} from './types';
import {IUser} from '../models/types';


// Get Mongoose models
import Message from '../models/message';

// Send all existing messages as JSON.  Note that author data is partially 
// populated in this response.
export const respondWithMessages: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const messages = await Message.find()
            .populate('author', 'createdAt updatedAt displayName photos')
            .exec();

        res.json(messages);
    }

    catch(e) {
        next(e);
    }
    
}

// Create a new message and respond with the created message.
export const createMessage: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const {text} = req.body;

        const newMessage = await Message.create({text, author: req.user._id});
        
        res.json(newMessage);
    }

    catch(e) {
        next(e);
    }
}

// delete a message.
export const deleteMessage: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const messageToDelete = await Message.findById(req.params.id);

        if(!messageToDelete) {
            throw new Error('Message not found')
        }

        else if(!messageToDelete.isAuthorizedRequest(req)){
            throw new Error('Unauthorized request');
        }

        else {
            await messageToDelete.remove();
            res.status(204).send();
        }
    }

    catch(e) {
        next(e);
    }
}