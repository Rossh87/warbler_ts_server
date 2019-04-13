"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        familyName: {
            type: String,
            lowercase: true
        },
        givenName: {
            type: String,
            lowercase: true
        },
    },
    providerIDs: {
        google: String,
        facebook: String
    },
    photos: [{ value: String }],
    emails: [{
            value: {
                type: String,
                required: true
            }
        }]
});
exports.default = mongoose_1.default.model('User', userSchema);
