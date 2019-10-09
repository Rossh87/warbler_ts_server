import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "./types";

export const userSchema = new Schema<IUser>(
    {
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
            }
        },

        provider: {
            type: String
        },

        photos: [{ value: String }],

        emails: [
            {
                value: {
                    type: String,
                    required: true
                }
            }
        ],

        following: [
            {
                type: Schema.Types.ObjectId,
                required: false
            }
        ],

        messages: [
            {
                type: Schema.Types.ObjectId,
                required: true
            }
        ]
    },
    {
        timestamps: true
    }
);

// add a convenience method for getting the object ids stored in 'following'
// as strings. We'll assert on these in testing.
userSchema.methods.getFollowingStrings = function() {
    return idToString(this.following);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;

// hacky helper for User.following.  Getters for arrays don't seem to work
// great in Mongoose.
function idToString(following: Array<mongoose.Types.ObjectId>) {
    return following.map((id) => id.toHexString());
}
