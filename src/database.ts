import mongoose from 'mongoose';

// Get credentials from env vars
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;

// Currently recycling a database, this may change.
mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds243059.mlab.com:43059/yelp_camp`);