import {AuthenticatedReqHandler} from './handlerTypes';

import {IUser} from '../models/user';

export const respondWithUserData: AuthenticatedReqHandler<IUser> = (req, res) => {
    res.json(req.user);
}