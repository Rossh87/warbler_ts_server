import { RequestHandler } from "express-serve-static-core";

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
    if(req.user) {
        next();
    }

    else {
        res.status(401).send('Request failed, permission denied.');
    }
}

export const ensureAuthorized: RequestHandler = (req, res, next) => {
    if(req.params._id === req.user._id) {
        next();
    }

    else{
        res.status(401).send('Request failed, permission denied.')
    }
}