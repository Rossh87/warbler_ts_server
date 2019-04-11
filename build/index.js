"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = __importDefault(require("./middlewares"));
// passport auth strategies
var googleStrat_1 = __importDefault(require("./strategies/googleStrat"));
// Env vars
var PORT = process.env.PORT;
middlewares_1.default.get('/', function (req, res) {
    debugger;
    res.send('./index.html');
});
middlewares_1.default.get('/auth/google', googleStrat_1.default.authenticate('google', { scope: ['profile'] }));
middlewares_1.default.get('/auth/google/callback', googleStrat_1.default.authenticate('google', { failureRedirect: '/' }));
middlewares_1.default.listen(PORT || 3001, function () {
    console.log("listening on " + PORT);
});
