import express from 'express';
import initMiddlewares from './middlewares';

// connect to database
import './database';

// Get routes
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

const PORT = process.env.PORT;

// Get an express instance with middleware
const app = initMiddlewares(express());

// Mount routers
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Universal error handler

app.listen(PORT || 3001, () => {
    console.log(`listening on ${PORT}`);
});


