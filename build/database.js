"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// Get credentials from env vars
var MLAB_USERNAME = process.env.MLAB_USERNAME;
var MLAB_PW = process.env.MLAB_PW;
// DB with dummy data is configured for testing, use it
// if NODE_ENV === test
var DB_URL = process.env.NODE_ENV === 'test' ?
    "mongodb://" + MLAB_USERNAME + ":" + MLAB_PW + "@ds229415.mlab.com:29415/warbler_test_db"
    :
        "mongodb://" + MLAB_USERNAME + ":" + MLAB_PW + "@ds163870.mlab.com:63870/warbler_ts_db";
mongoose_1.default.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});
exports.default = mongoose_1.default;
