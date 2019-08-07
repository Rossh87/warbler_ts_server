// These routes are a clone of the api routes, but contain no authentication logic
// for development purposes.  They will be disabled in production.
import express, { RequestHandler } from "express";

// Get route handlers for data/logic
import { respondWithUserData } from "../handlers/user";
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
router.get("/user", withCatch(respondWithUserData));

// Message routes
router.get("/messages", withCatch(respondWithMessages));
router.post("/messages/create", withCatch(createMessage));
router.delete("/messages/:id", withCatch(deleteMessage));

export default router;
