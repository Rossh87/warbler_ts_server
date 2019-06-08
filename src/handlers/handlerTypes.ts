import express, {RequestHandler, Request, Response, NextFunction} from 'express';


// Tighten up type definitions to add user data prop
export interface IAuthenticatedRequest<T> extends Request {
    user: T
};

export interface AuthenticatedReqHandler<UserShape> {
    (req:IAuthenticatedRequest<UserShape>, res: Response, next: NextFunction):any
}