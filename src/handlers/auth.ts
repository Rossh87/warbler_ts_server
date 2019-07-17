import { RequestHandler } from "express-serve-static-core";

export const ensureAuthenticated: RequestHandler = (req, res, next) => {

    if(req.user) {
        next();
    }

    else {
        res.status(401).send('Request failed, authentication required.');
    }
}

// export const ensureAuthorizedForMessage: RequestHandler = (req, res, next) => {
//     // All requests 
//     if(req.params._id === req.user._id) {
//         next();
//     }

//     else{
//         res.status(403).send('FORBIDDEN')
//     }
// }
