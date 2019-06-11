import mongoose, {Schema, Model} from 'mongoose';
import {IUser} from './types';

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true,
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

    provider: {
        type: String
    },

    photos: [{value: String}],

    emails: [{
        value: {
            type: String,
            required: true
        }
    }],

    messages: [{
        type: Schema.Types.ObjectId,
        required: true
    }]
}, {
    timestamps: true
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;