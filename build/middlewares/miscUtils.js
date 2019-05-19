"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var initMiscUtils = function (app) {
    debugger;
    app.use(cors_1.default());
    app.use(body_parser_1.default.json());
    return app;
};
exports.default = initMiscUtils;
