// Get needed types
import {AuthenticatedReqHandler} from './types';
import {IUser} from '../models/types';

// Bring in controller that interfaces with data layer
import * as dbController from '../dbController';

// Send all existing messages as JSON.  Note that author data is partially 
// populated in this response.
export const respondWithMessages: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const messages = await dbController.getPopulatedMessages();
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

        const newMessage = await dbController.createMessage(text, req.user.id);

        res.json(newMessage);
    }

    catch(e) {
        next(e)
    }
}