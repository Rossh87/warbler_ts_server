import { RequestHandler } from "express-serve-static-core";

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
    if(req.user) {
        next();
    }

    else {
        res.status(401).send('Authorization required');
    }
}