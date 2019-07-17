import express, {RequestHandler} from 'express';

// Get route handlers for data/logic
import {respondWithUserData} from '../handlers/user';
import {
    respondWithMessages,
    createMessage, 
    deleteMessage
} from '../handlers/messages';

// Authorization gate middleware
import {ensureAuthenticated} from '../handlers/auth';

const router = express.Router();

// User routes
router.get('/user', ensureAuthenticated, respondWithUserData as RequestHandler);

// Message routes
router.get('/messages', ensureAuthenticated, respondWithMessages as RequestHandler);
router.post('/messages/create', ensureAuthenticated, createMessage as RequestHandler);
router.delete('/messages/:id', ensureAuthenticated, deleteMessage as RequestHandler)


export default router;