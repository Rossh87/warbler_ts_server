import {Profile as PassportProfile} from 'passport';
import {
    Strategy as GoogleStrat,
    GoogleVerify
} from 'passport-google-oauth20';

// Get mongoose model
import User from '../../../models/user';

// Get helper function to modify profile object before saving to DB
import {replacePropName} from './stratUtils';

// Google OAuth keys saved as env vars
const GAUTH_CLIENT_ID = <string>process.env.GAUTH_CLIENT_ID;
const GAUTH_CLIENT_SECRET = <string>process.env.GAUTH_CLIENT_SECRET;

// Establish type for 'verify' callback function, then define function
const googleVerify: GoogleVerify<PassportProfile> =
async (token, secret, profile, done) => {
    try {
        const foundUser = await User.findOne({
            providerIDs: {
                google: profile.id
            }
        });

        // If no User document exists for the profile in question,
        // create one and pass it to 'done' callback.
        if(!foundUser) {
            // Change profile.id to more explicit value to avoid confusion
            // with database document property '_id'  
            const userObj = replacePropName(profile, 'id', 'providerId');

            const newUser = await User.create(userObj);

            // It is necessary to pass mongoose document, not just
            // userObj, to done, so that the document _id (rather than provider id from profile)
            // can be used to serialize the user.
            done(null, newUser)
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

