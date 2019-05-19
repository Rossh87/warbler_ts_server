/*Largely borrowed from post by Github user umidbekkarimov here:
https://github.com/jaredhanson/passport-google-oauth2/issues/48

I've modified the signature of Strategy constructor's 'verify' param
to deal with some linter errors I couldn't find an explanation for.
**/

declare module 'passport-google-oauth20' {
    import {
        Strategy as PassportStrategy,
        Profile as PassportProfile,
    } from 'passport';

    export interface StrategyOptions {
        clientID: string,
        clientSecret: string,
        callbackURL: string
    }

    /* Generic interface with default values allows (but does
        not compel) us to specify a type for the profile that is passed
        in as a parameter, as well as the user object that will be 
        passed into callback.
    **/
    export interface GoogleVerify<TProfile = {}, TUser = any> {
        (
            token: string,
            tokenSecret: string,
            profile: PassportProfile,
            done: (err: Error | null, user?: TUser) => void
        ): void
    }

    export class Strategy extends PassportStrategy {
        public constructor(
            options: StrategyOptions,
            verify: GoogleVerify
        )
    }
}