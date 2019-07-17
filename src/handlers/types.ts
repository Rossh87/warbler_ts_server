import express, {RequestHandler, Request, Response, NextFunction} from 'express';


// Tighten up type definitions to add user data prop
export interface IAuthenticatedRequest<T> extends Request {
    user: T
};

export interface AuthenticatedReqHandler<T> extends RequestHandler {
    (req:IAuthenticatedRequest<T>, res: Response, next: NextFunction):any
}

export class HandlerError extends Error {

    constructor(public rawError: Error, public prettyMessage: string, public status?: number) {
        super();
        this.rawError = rawError;
        this.prettyMessage = prettyMessage;
        this.status = status;
    }
}