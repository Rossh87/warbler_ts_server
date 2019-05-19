import {
    Strategy as FacebookStrat,
    Profile,
    VerifyFunction
} from 'passport-facebook';

// Get mongoose model and user type
import User, {IUser} from '../../../models/user';

// Facebook OAuth keys saved as env vars
const FBOOK_CLIENT_ID = <string>process.env.FBOOK_CLIENT_ID;
const FBOOK_CLIENT_SECRET = <string>process.env.FBOOK_CLIENT_SECRET;

// Establish type for 'verify' callback function, then define function
const facebookVerify: VerifyFunction =
async (token, secret, profile, done) => {
    try {
        const foundUser = await User.findOne({
            provider: 'facebook',
            id: profile.id
        }).lean();

        // If no User document exists for the profile in question,
        // create one and pass it to 'done' callback.
        if(!foundUser) {
            // Add providerIDs prop to profile object in a way that
            // doesn't upset TS compiler.  
            const userObj = Object.assign(profile, {
                providerIDs: {
                    facebook: profile.id
                }
            });

            const newUser = await User.create(userObj);
            console.log('user created', newUser);
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

export default new FacebookStrat({
    clientID: FBOOK_CLIENT_ID,
    clientSecret: FBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:8001/auth/facebook/callback',
    enableProof: true
}, facebookVerify);

