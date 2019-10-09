import { Document } from "mongoose";
import { Request } from "express";
import mongoose from "../database";

// Type for Message documents retrieved by Mongoose (with Mongoose wrapper)
export interface IMessage extends Document {
    text: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    isAuthorizedRequest: (req: Request) => boolean;
}

// Type of the populated 'author' prop on Message documents sent to client
// that do not belong to the currently authenticated user
export type TPopulatedAuthor = Pick<
    IUser,
    "createdAt" | "updatedAt" | "displayName" | "photos"
>;

// Type for User documents retrieved by Mongoose (with Mongoose wrapper)
export interface IUser extends Document {
    displayName: string;

    name: {
        familyName: string;
        givenName: string;
    };

    provider: string;

    photos: { [value: string]: string }[];

    emails: { [value: string]: string }[];

    messages: string[];

    createdAt: string;

    updatedAt: string;

    following: mongoose.Types.ObjectId[];

    getFollowingStrings: () => string[];
}
