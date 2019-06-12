"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = function (req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.status(401).send('Request failed, permission denied.');
    }
};
exports.ensureAuthorized = function (req, res, next) {
    if (req.params._id === req.user._id) {
        next();
    }
    else {
        res.status(401).send('Request failed, permission denied.');
    }
};
// Validation function to permit local requests to proceed w/out authorization
var isLocalOrigin = function (path) {
    var exp = /^http\:\/\/localhost\:.*/;
    return exp.test(path);
};
