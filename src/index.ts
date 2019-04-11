// Get configured Express instance
import app from './middlewares';

// Get connection to MongoDB running on MLab cloud server
import './database';

// Get passport auth strategies
import passport from './strategies/googleStrat';

// Env vars
const PORT = process.env.PORT;

app.get(
    '/auth/google',
    passport.authenticate('google', {scope: ['profile']})
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'})
)

app.listen(PORT || 3001, () => {
    console.log(`listening on ${PORT}`);
});