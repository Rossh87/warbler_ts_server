"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Get loader functions for all express middleware modules
var miscUtils_1 = __importDefault(require("./miscUtils"));
var session_1 = __importDefault(require("./session"));
var passport_1 = __importDefault(require("./passport"));
// Pipe function accepts middleware init functions and returns a single function.
// Returned function will be invoked
// with an express instance, and returns an express instance configured with middlewares.
var initPipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (app) { return fns.reduce(function (result, fn) { return fn(result); }, app); };
};
// NB: session should be initialized BEFORE passport to ensure correct
// session restorations
var initMiddlewares = initPipe(miscUtils_1.default, session_1.default, passport_1.default);
exports.default = initMiddlewares;
