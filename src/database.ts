import mongoose, { mongo } from "mongoose";

// Get credentials from env vars
const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;

const DB_URL = `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds163870.mlab.com:63870/warbler_ts_db`;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});
/*The line below sets a customer getter for the id property of all Mongoose documents/schemas.
It causes Mongoose docs to return a string when their id prop is accessed rather than the native
js object of type ObjectId
*/

// @ts-ignore
mongoose.ObjectId.get((v) => v.toString());

export default mongoose;
