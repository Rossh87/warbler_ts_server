import { RequestHandler } from "express-serve-static-core";
import { hostname } from "os";

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

// Validation function to permit local requests to proceed w/out authorization
const isLocalOrigin = (path: string) => {
    const exp = /^http\:\/\/localhost\:.*/;

    return exp.test(path);
}