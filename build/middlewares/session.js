"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_session_1 = __importDefault(require("express-session"));
var connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
// Get database credentials and secret to encrypt 
// session cookies
var MLAB_USERNAME = process.env.MLAB_USERNAME;
var MLAB_PW = process.env.MLAB_PW;
var SESSION_SECRET = process.env.SESSION_SECRET;
var initSession = function (app) {
    debugger;
    // Calling c-m-s default export with session returns a
    // constructor function
    var SessionStore = connect_mongodb_session_1.default(express_session_1.default);
    // Create instance of c-m-s store that we will pass to express-session
    // as part of its config object
    var sessionStore = new SessionStore({
        uri: "mongodb://" + MLAB_USERNAME + ":" + MLAB_PW + "@ds163870.mlab.com:63870/warbler_ts_db",
        collection: 'warblerSessions'
    });
    // If SESSION_SECRET is undefined, app is not secure.
    // Here we define a verification function to break the app
    // if secret is not provided.
    var verifyPresenceOfSecret = function () {
        if (SESSION_SECRET) {
            return SESSION_SECRET;
        }
        throw new Error('Session secret must not be undefined');
    };
    app.use(express_session_1.default({
        secret: verifyPresenceOfSecret(),
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
    debugger;
    return app;
};
exports.default = initSession;
