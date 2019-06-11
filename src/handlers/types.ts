import express, {RequestHandler, Request, Response, NextFunction} from 'express';


// Tighten up type definitions to add user data prop
export interface IAuthenticatedRequest<T> extends Request {
    user: T
};

export interface AuthenticatedReqHandler<T> {
    (req:IAuthenticatedRequest<T>, res: Response, next: NextFunction):any
}