import mongoose, {Document, Schema} from 'mongoose';
import {Profile as PassportProfile} from 'passport';

// This interface represents only the salient data in
// a user document, without any of the properties provided
// by mongoose class constructor.
export interface IUser extends PassportProfile {    
    providerIDs: {
        google?: string,
        facebook?: string
    }
}

// Intersection type to represent a retrieved user document,
// including extra goodies from mongoose
export type TUserDoc = IUser & Document;

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    name: {
        familyName: {
            type: String,
            lowercase: true
        },
        givenName: {
            type: String,
            lowercase: true
        },
    },

    providerIDs: {
        google: String,
        facebook: String
    },

    photos: [{value: String}],

    emails: [{
        value: {
            type: String,
            required: true
        }
    }]
});

export default mongoose.model('User', userSchema);