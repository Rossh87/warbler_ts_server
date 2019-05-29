import {
    Strategy as FacebookStrat,
    VerifyFunction
} from 'passport-facebook';

// Get mongoose model
import User from '../../../models/user';

// Get helper function to modify profile object before saving to DB
import {replacePropName} from './stratUtils';

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
        });

        // If no User document exists for the profile in question,
        // create one and pass it to 'done' callback.
        if(!foundUser) {
            // Change profile.id to more explicit value to avoid confusion
            // with database document property '_id'  
            const userObj = replacePropName(profile, 'id', 'providerId');

            const newUser = await User.create(userObj);

            // It is necessary to pass mongoose document, not just
            // userObj, to done, so that the document _id 
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

