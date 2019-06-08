"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// Get route handlers for data/logic
var user_1 = require("../handlers/user");
var messages_1 = require("../handlers/messages");
// Authorization gate middleware
var auth_1 = require("../handlers/auth");
// Create router instance
var router = express_1.default.Router();
// Type cast our handler to soothe the TS compiler
router.get('/user', auth_1.ensureAuthenticated, user_1.respondWithUserData);
router.get('/messages', auth_1.ensureAuthenticated, messages_1.respondWithMessages);
router.post('/messages/create', auth_1.ensureAuthenticated, messages_1.createMessage);
exports.default = router;
