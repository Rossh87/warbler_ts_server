import {Document} from 'mongoose';
import {TDiffTypeProps} from '../declarations/utilityTypes';
import {Request} from 'express';

// Type for Message documents retrieved by Mongoose (with Mongoose wrapper)
export interface IMessage extends Document {
    text: string,
    createdAt: string,
    updatedAt: string,
    author: string,
    isAuthorizedRequest: (req: Request) => boolean
};

export type TLeanMessage = TDiffTypeProps<IMessage, Document>;

// This is the type that the 'author' field of Message documents will have
// in a response.
export type TTrimmedAuthor = Pick<IUser, 'photos' | 'displayName' | 'createdAt' | 'updatedAt'>

// Type for User documents retrieved by Mongoose (with Mongoose wrapper)
export interface IUser extends Document {    
    displayName: string,

    name: {
        familyName: string,
        givenName: string
    },

    provider: string,

    photos: {[value: string]: string} [],

    emails: {[value: string]: string} [],

    messages: string [],
    
    createdAt: string,

    updatedAt: string
};

export type TLeanUser = TDiffTypeProps<IUser, Document>;

