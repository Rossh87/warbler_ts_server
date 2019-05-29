import cors from 'cors';
import bodyParser from 'body-parser';
import { IInitFunction } from '.';

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

const initMiscUtils: IInitFunction = app => {
    app.use(cors(corsOptions));
    app.use(bodyParser.json());

    return app;
}

export default initMiscUtils;
