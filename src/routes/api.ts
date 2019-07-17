import express, {RequestHandler} from 'express';

// Get route handlers for data/logic
import {respondWithUserData} from '../handlers/user';
import {
    respondWithMessages,
    createMessage, 
    deleteMessage
} from '../handlers/messages';
import {withCatch} from '../handlers/error';

// Authorization gate middleware
import {ensureAuthenticated} from '../handlers/auth';

const router = express.Router();

// User routes
router.get('/user', ensureAuthenticated, withCatch(respondWithUserData));

// Message routes
router.get('/messages', ensureAuthenticated, withCatch(respondWithMessages));
router.post('/messages/create', ensureAuthenticated, withCatch(createMessage));
router.delete('/messages/:id', ensureAuthenticated, withCatch(deleteMessage));


export default router;