import {Express} from 'express';
// Get loader functions for all express middleware modules
import initMiscUtils from './miscUtils';
import initSession from './session';
import initPassport from './passport';

// Middleware init functions must accept and return an express instance
export interface IInitFunction {
    (app: Express): Express
}

// Pipe function accepts middleware init functions and returns a single function.
// Returned function will be invoked
// with an express instance, and returns an express instance configured with middlewares.
const initPipe = (...fns: IInitFunction []) => (app : Express) => fns.reduce((result, fn) => fn(result), app);

// NB: session should be initialized BEFORE passport to ensure correct
// session restorations
const initMiddlewares: IInitFunction = initPipe(initMiscUtils, initSession, initPassport);
export default initMiddlewares;