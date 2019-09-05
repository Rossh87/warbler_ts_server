// Get needed types
import { RequestHandler, ErrorRequestHandler } from "express";
import { CustomError } from "./types";

export interface ITestFn {
    (res: any): boolean;
}

export interface IValidateOrThrow<T> {
    (res: Promise<T>): Promise<T> | never;
}

// Wrap async route handlers with HOC to add a catch block that passes any error
// that occurs in routes to Express
export const withCatch = (fn: RequestHandler): RequestHandler => {
    return function(req, res, next) {
        return fn(req, res, next).catch((err: any) => next(err));
    };
};

// Util to make an error with a few custom props
export const throwErr = (message: string, status?: number): never => {
    throw new CustomError(message, status);
};

// Check if result of a successful async call meets our needs or
// if it should throw.  Mostly used to check if result of executing Mongoose
// Query is null.
export const validateOrThrow = <T>(
    testFN: ITestFn,
    message: string,
    status?: number
): IValidateOrThrow<T> => {
    return async function(promise) {
        const resolvedPromise = await promise;

        if (!testFN(resolvedPromise)) {
            throwErr(`${message} (validation failed)`, status);
        }

        return resolvedPromise;
    };
};

export const handleErrors: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status).json(err);
};
