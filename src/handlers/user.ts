// Get types
import {AuthenticatedReqHandler} from './types';
import {IUser} from '../models/types';

export const respondWithUserData: AuthenticatedReqHandler<IUser> = (req, res) => {
    res.json(req.user);
}