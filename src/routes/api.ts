import express, {RequestHandler, Request, Response} from 'express';
const router = express.Router();

// Middleware to ensure request is authenticated before sending data
import {ensureAuthenticated} from '../handlers/auth';

// Type of user property added to req object from session storage
import { IUser } from '../models/user';

// Tighten up type definitions to add user data prop
export interface IAuthenticatedRequest<T> extends Request {
    user: T
};

export interface AuthenticatedReqHandler<UserShape> {
    (req:IAuthenticatedRequest<UserShape>, res: Response):any
}

export const respondWithUserData: AuthenticatedReqHandler<IUser> = (req, res) => {
    res.json(req.user);
}

// Type cast our handler to soothe the TS compiler
router.get('/user', ensureAuthenticated, respondWithUserData as RequestHandler);

export default router;