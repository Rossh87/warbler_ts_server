// Get basic express dependencies
import express from 'express' 
import cors from 'cors';
import bodyParser from 'body-parser';

// Auth dependencies
import passport from 'passport';
import session from 'express-session';
import User, {TUserDoc} from './models/user';
import googleStrategy from './strategies/googleStrat';

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET;

// If SESSION_SECRET is undefined, app is not secure.
// Here we define a verification function to break the app
// if secret is not provided.
const verifyPresenceOfSecret: () => string | void = () => {
    if(SESSION_SECRET) {
        return SESSION_SECRET;
    }

    throw new Error('Session secret must not be undefined');
};

// Begin middlewares
app.use(cors());
app.use(bodyParser.json());

// Auth middlewares
passport.use(googleStrategy);

passport.serializeUser<TUserDoc, string>((userParam, done) => {
    console.log('from serialize', userParam);
    done(null, userParam._id);
});

passport.deserializeUser<TUserDoc, string>(async (_id, done) => {
    try {
        const foundUser = await User.findById(_id);
        done(null, <TUserDoc>foundUser);
    }

    catch(err) {
        done(err);
    }
});

app.use(session({
    secret: <string>verifyPresenceOfSecret(),
}));
app.use(passport.initialize());
app.use(passport.session());

export default app;