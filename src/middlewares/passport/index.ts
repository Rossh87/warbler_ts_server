// Auth dependencies
import passport from 'passport';
import User, {TUserDoc} from '../../models/user';
import googleStrategy from './strategies/googleStrat';
import facebookStrategy from './strategies/facebookStrat';


// type fluff
import {IInitFunction} from '../';

const initPassport: IInitFunction = (app) => {
    passport.use(googleStrategy);

    passport.use(facebookStrategy);

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

    app.use(passport.initialize());
    
    app.use(passport.session());

    return app;
}

export default initPassport;