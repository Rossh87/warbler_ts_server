"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
var initMiscUtils = function (app) {
    app.use(cors_1.default(corsOptions));
    app.use(body_parser_1.default.json());
    return app;
};
exports.default = initMiscUtils;
