import passport, {Profile as PassportProfile} from 'passport';
import {
    Strategy as GoogleStrat,
    GoogleVerify
} from 'passport-google-oauth20';

// Get mongoose model and user type
import User, {IUser} from '../models/user';

// Google OAuth keys saved as env vars
const GAUTH_CLIENT_ID = <string>process.env.GAUTH_CLIENT_ID;
const GAUTH_CLIENT_SECRET = <string>process.env.GAUTH_CLIENT_SECRET;

// Establish type for 'verify' callback function, then define function
const googleVerify: GoogleVerify<PassportProfile, IUser> =
async (token, secret, profile, done) => {
    try {
        const foundUser = await User.findOne({
            providerIDs: {
                google: profile.id
            }
        }).lean();

        // If no User document exists for the profile in question,
        // create one and pass it to 'done' callback.
        if(!foundUser) {
            // Add providerIDs prop to profile object in a way that
            // doesn't upset TS compiler.  Note that result is an inferred
            // type identical to IUser
            
            const userObj = Object.assign(profile, {
                providerIDs: {
                    google: profile.id
                }
            });

            const newUser = await User.create(userObj);
            console.log('user created', newUser);
            done(null, userObj)
        }

        else {
            console.log('user found', foundUser);
            done(null, foundUser);
        }
    }

    catch(err) {
        done(err);
    }
}

export default new GoogleStrat({
    clientID: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:8001/auth/google/callback'
}, googleVerify);

