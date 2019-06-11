import express from 'express';
import passport from 'passport';
const router = express.Router();

// Google auth routes
router.get(
    '/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        const {_id} = req.user;
        res.redirect(`http://localhost:3000/users/${_id}`);
    }
);

// Facebook auth routes
router.get(
    '/facebook',
    passport.authenticate('facebook')  
);

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    (req, res) => {
        const {_id} = req.user;
        res.redirect(`http://localhost:3000/users/${_id}`);
    }
);

// Signout
router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
});

export default router;