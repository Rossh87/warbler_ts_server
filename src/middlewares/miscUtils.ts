import cors from 'cors';
import bodyParser from 'body-parser';
import { IInitFunction } from '.';

const initMiscUtils: IInitFunction = app => {
    debugger;
    app.use(cors());
    app.use(bodyParser.json());

    return app;
}

export default initMiscUtils;
