import express, {RequestHandler} from 'express';

// Get route handlers for data/logic
import {respondWithUserData} from '../handlers/user';
import {respondWithMessages, createMessage} from '../handlers/messages';

// Authorization gate middleware
import {ensureAuthenticated, ensureAuthorized} from '../handlers/auth';

const router = express.Router();

// Type cast our handler to soothe the TS compiler
router.get('/user', ensureAuthenticated, respondWithUserData as RequestHandler);
router.get('/messages', ensureAuthenticated, respondWithMessages as RequestHandler);
router.post('/messages/create', ensureAuthenticated, createMessage as RequestHandler);


export default router;