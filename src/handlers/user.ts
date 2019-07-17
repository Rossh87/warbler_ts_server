// Get types
import {RequestHandler} from 'express';

// Passport deserializes user data from authenticated requests and attaches it to 
// request object, so we simply return that data as JSON.  Function is async to allow
// us to use a catch block for errors--this is purely for consistency with
// the rest of codebase.
export const respondWithUserData: RequestHandler = async (req, res) => {
    res.json(req.user);
}