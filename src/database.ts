import mongoose from 'mongoose';

// Get credentials from env vars
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;

// DB with dummy data is configured for testing, use it
// if NODE_ENV === test
const DB_URL = process.env.NODE_ENV === 'test' ?
    `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`
    :
    `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds163870.mlab.com:63870/warbler_ts_db`

mongoose.connect(
    DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
);

export default mongoose;