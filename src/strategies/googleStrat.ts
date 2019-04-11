import passport from 'passport';
// const GoogleStrat = require('passport-google-oauth').OAuthStrategy
import {Strategy as GoogleStrat} from 'passport-google-oauth20';

// Google OAuth keys saved as env vars
const GAUTH_CLIENT_ID = <string>process.env.GAUTH_CLIENT_ID;
const GAUTH_CLIENT_SECRET = <string>process.env.GAUTH_CLIENT_SECRET;

passport.use(new GoogleStrat({
    clientID: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
(token, tokensecret, profile, done) => {
    console.log(profile);
}
));

export default passport;