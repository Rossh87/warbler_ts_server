import express from 'express' 
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';

// Begin middlewares
app.use(cors());
app.use(bodyParser.json());

export default app;