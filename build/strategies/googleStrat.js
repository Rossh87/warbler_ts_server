"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
// const GoogleStrat = require('passport-google-oauth').OAuthStrategy
var passport_google_oauth20_1 = require("passport-google-oauth20");
// Google OAuth keys saved as env vars
var GAUTH_CLIENT_ID = process.env.GAUTH_CLIENT_ID;
var GAUTH_CLIENT_SECRET = process.env.GAUTH_CLIENT_SECRET;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (token, tokensecret, profile, done) {
    console.log(profile);
}));
exports.default = passport_1.default;
