import express, { RequestHandler } from "express";

// Get route handlers for data/logic
import {
    respondWithUserData,
    respondWithSessionStatus,
    addFollowed,
    removeFollowed
} from "../handlers/user";

import {
    respondWithMessages,
    createMessage,
    deleteMessage
} from "../handlers/messages";

import { withCatch } from "../handlers/error";

// Authorization gate middleware
import { ensureAuthenticated } from "../handlers/auth";

const router = express.Router();

// User routes
router.get("/user", ensureAuthenticated, withCatch(
    respondWithUserData
) as RequestHandler);

router.get("/sessionStatus", ensureAuthenticated, respondWithSessionStatus);

router.post("/user/following", ensureAuthenticated, withCatch(
    addFollowed
) as RequestHandler);

router.patch("/user/following", ensureAuthenticated, withCatch(
    removeFollowed
) as RequestHandler);

// Message routes
router.get("/messages", ensureAuthenticated, withCatch(
    respondWithMessages
) as RequestHandler);

router.post("/messages", ensureAuthenticated, withCatch(
    createMessage
) as RequestHandler);

router.delete("/messages/:id", ensureAuthenticated, withCatch(
    deleteMessage
) as RequestHandler);

export default router;
