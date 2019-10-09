import session from "express-session";
import sessionStoreConstructor from "connect-mongodb-session";
import { IInitFunction } from ".";

// Get database credentials and secret to encrypt
// session cookies
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;
const SESSION_SECRET = process.env.SESSION_SECRET;

const initSession: IInitFunction = (app) => {
    // Calling c-m-s default export with session returns a
    // constructor function
    const SessionStore = sessionStoreConstructor(session);

    // Create instance of c-m-s store that we will pass to express-session
    // as part of its config object
    const sessionStore = new SessionStore({
        uri: `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds163870.mlab.com:63870/warbler_ts_db`,
        collection: "warblerSessions"
    });

    // If SESSION_SECRET is undefined, app is not secure.
    // Here we define a verification function to break the app
    // if secret is not provided.
    const verifyPresenceOfSecret: () => string | never = () => {
        if (SESSION_SECRET) {
            return SESSION_SECRET;
        }

        throw new Error("Session secret must not be undefined");
    };

    app.use(
        session({
            secret: <string>verifyPresenceOfSecret(),
            store: sessionStore,
            resave: false,
            saveUninitialized: false
        })
    );
    return app;
};

export default initSession;
