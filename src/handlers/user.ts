// Get types
import {AuthenticatedReqHandler} from './types';
import {IUser} from '../models/types';

// Passport deserializes user data from authenticated requests and attaches it to 
// request object, so we simply return that data as JSON.
export const respondWithUserData: AuthenticatedReqHandler<IUser> = (req, res) => {
    res.json(req.user);
}