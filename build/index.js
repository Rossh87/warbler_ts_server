"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Get configured Express instance
var middlewares_1 = __importDefault(require("./middlewares"));
// Get connection to MongoDB running on MLab cloud server
require("./database");
var passport_1 = __importDefault(require("passport"));
// Env vars
var PORT = process.env.PORT;
middlewares_1.default.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
middlewares_1.default.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    var _id = req.user._id;
    res.redirect("http://localhost:3000/users/" + _id);
});
middlewares_1.default.listen(PORT || 3001, function () {
    console.log("listening on " + PORT);
});
