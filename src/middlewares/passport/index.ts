// Auth dependencies
import passport from 'passport';
import User from '../../models/user';
import googleStrategy from './strategies/googleStrat';
import facebookStrategy from './strategies/facebookStrat';


// type fluff
import {IInitFunction} from '../';
import {IUser} from '../../models/types';

const initPassport: IInitFunction = (app) => {
    passport.use(googleStrategy);

    passport.use(facebookStrategy);

    passport.serializeUser<IUser, string>((userParam, done) => {
        console.log('from serialize', userParam);
        done(null, userParam._id);
    });

    passport.deserializeUser<IUser, string>(async (_id, done) => {
        try {
            const foundUser = await User.findById(_id);
            done(null, <IUser>foundUser);
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