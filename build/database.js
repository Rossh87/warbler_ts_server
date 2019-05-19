"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// Get credentials from env vars
var MLAB_USERNAME = process.env.MLAB_USERNAME;
var MLAB_PW = process.env.MLAB_PW;
// Currently recycling a database, this may change.
mongoose_1.default.connect("mongodb://" + MLAB_USERNAME + ":" + MLAB_PW + "@ds163870.mlab.com:63870/warbler_ts_db", {
    useNewUrlParser: true,
    useCreateIndex: true
});
exports.default = mongoose_1.default;
