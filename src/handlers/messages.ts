import {AuthenticatedReqHandler} from './handlerTypes';
import {IUser} from '../models/user';
import Message, {TPopulatedAuthor} from '../models/message';
import User from '../models/user';

export const respondWithMessages: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const messages = await Message.find()
    
        const populatedMsgs = await Promise.all(messages.map((msg) => {
            return msg.populate('author').execPopulate();
        }));

        // trim unwanted user properties from the author data
        // associated w/ each message
        const modelProps = ['createdAt', 'modifiedAt', 'displayName', 'photos'];

        const filteredMsgs = populatedMsgs.map(msg => {
            const target = msg.author;

            // type guard here to soothe compiler
            if(typeof target === 'string') {throw new Error()};
            
            
        });

        res.json(populatedMsgs);
    }

    catch(e) {
        next(e);
    }
    
}

export const createMessage: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const {text} = req.body;
        
        const newMessage = await Message.create({text: text, author: req.user._id});

        res.json(newMessage);
    }

    catch(e) {
        next(e)
    }
}