// Get needed types
import {RequestHandler, ErrorRequestHandler} from 'express';
import {HandlerError} from './types';

export const withCatch = (fn: RequestHandler): RequestHandler => {
    return async function(req, res, next) {
        return fn(req, res, next).catch((err: any) => next(err));
    }
};

export const handleErrors: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err.rawError);
    res.status(err.status || 500);
    res.send(err.prettyMessage);
};