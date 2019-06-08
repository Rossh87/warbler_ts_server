"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondWithUserData = function (req, res) {
    res.json(req.user);
};
