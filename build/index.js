"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var middlewares_1 = __importDefault(require("./middlewares"));
// connect to database
require("./database");
// Get routes
var auth_1 = __importDefault(require("./routes/auth"));
var PORT = process.env.PORT;
// Get an express instance with middleware
var app = middlewares_1.default(express_1.default());
app.use('/auth', auth_1.default);
app.listen(PORT || 3001, function () {
    console.log("listening on " + PORT);
});
