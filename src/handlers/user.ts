// Get types
import { RequestHandler } from "express";
import { TAuthenticatedReqHandler } from "./types";
import { IUser } from "../models/types";
import User from "../models/user";

// utils
import { throwErr } from "./error";

// Passport deserializes user data from authenticated requests and attaches it to
// request object, so we simply return that data as JSON.  Function is async to allow
// us to use a catch block for errors--this is purely for consistency with
// the rest of codebase.
export const respondWithUserData: RequestHandler = async (req, res) => {
    res.json(req.user);
};

export const respondWithSessionStatus: RequestHandler = async (req, res) => {
    res.json({ sessionIsActive: !!req.user });
};

export const addFollowed: TAuthenticatedReqHandler = async (req, res) => {
    const { _id } = req.user;

    const { follow } = req.body;

    const dbUser = await User.findById({ _id }).exec();

    if (dbUser === null) {
        throwErr("Unable to locate user to add follower", 500);
    } else {
        dbUser.following.push(follow);
        const updatedUser = await dbUser.save();
        res.json(updatedUser);
    }
};

export const removeFollowed: TAuthenticatedReqHandler = async (req, res) => {
    const { _id } = req.user;

    const { unfollow } = req.body;

    const dbUser = await User.findById({ _id }).exec();

    if (dbUser === null) {
        throwErr("Unable to locate user to remove follower", 500);
    } else {
        dbUser.following = dbUser.following.filter(
            (id) => id.toHexString() !== unfollow
        );
        const updatedUser = await dbUser.save();
        res.json(updatedUser);
    }
};
