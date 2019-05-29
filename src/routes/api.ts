import express, {RequestHandler, Request, Response, NextFunction} from 'express';
const router = express.Router();

// Middleware to ensure request is authenticated before sending data
import {ensureAuthenticated} from '../handlers/auth';

// Type of user property added to req object from session storage
import User, { IUser } from '../models/user';

// Get message model
import Message from '../models/message';

// Tighten up type definitions to add user data prop
export interface IAuthenticatedRequest<T> extends Request {
    user: T
};

export interface AuthenticatedReqHandler<UserShape> {
    (req:IAuthenticatedRequest<UserShape>, res: Response, next: NextFunction):any
}

export const respondWithUserData: AuthenticatedReqHandler<IUser> = (req, res) => {
    res.json(req.user);
}

export const respondWithMessages: AuthenticatedReqHandler<IUser> = async (req, res, next) => {
    try {
        const allMessages = await Message.find();
        res.json(allMessages);
    }

    catch(e) {
        next(e);
    }
}

// Type cast our handler to soothe the TS compiler
router.get('/user', ensureAuthenticated, respondWithUserData as RequestHandler);
router.get('/messages', respondWithMessages as RequestHandler);

export default router;