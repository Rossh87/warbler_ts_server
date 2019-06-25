import {testDBController} from './testUtils';

const MLAB_USERNAME = process.env.MLAB_USERNAME;
const MLAB_PW = process.env.MLAB_PW;

const config = {
    uri: `mongodb://${MLAB_USERNAME}:${MLAB_PW}@ds229415.mlab.com:29415/warbler_test_db`,
    connectionOptions:{
        useNewUrlParser: true,
        useCreateIndex: true
    }
};

const db = new testDBController(config);

// db operations are async--it is critical we return them in setup/teardown
// functions to avoid race condition
beforeEach(() => {
    return db.saveMockUsers(3);
});

afterEach(() => {
    return db.clear();
});

test('testutil works', () => {

    expect(0).toBe(0);
});

