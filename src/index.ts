// Get configured Express instance
import app from './middlewares';

// Get connection to MongoDB running on MLab cloud server
import './database';

import passport from 'passport';

// Env vars
const PORT = process.env.PORT;

app.get(
    '/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        const {_id} = req.user;
        res.redirect(`http://localhost:3000/users/${_id}`);
    }
)

app.listen(PORT || 3001, () => {
    console.log(`listening on ${PORT}`);
});