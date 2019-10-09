import express, {
    RequestHandler,
    Request,
    Response,
    NextFunction
} from "express";

import { IUser } from "../models/types";

// Add 'user' property that will exist on request object of all authenticated requests
export interface IAuthenticatedRequest extends Request {
    user: IUser;
}

export type TAuthenticatedRequestHandler<T> = (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
) => any;

export type TAuthenticatedReqHandler = TAuthenticatedRequestHandler<IUser>;

export class CustomError extends Error {
    constructor(public message: string, public status?: number) {
        super();
        this.message = message;
        this.status = status;
    }
}
