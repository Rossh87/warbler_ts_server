"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = function (req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.status(401).send('Authorization required');
    }
};
