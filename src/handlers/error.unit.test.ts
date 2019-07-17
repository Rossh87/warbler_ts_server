import {handleErrors} from './error'
import {HandlerError} from './types';
import request from 'supertest';
import express from 'express';

const app = express();


let err: HandlerError;
// Throw an error on any request
app.get('*', (req, res) => {
    throw err;
});

app.use(handleErrors);

describe('Error handler', () => {
    it('sets res status to match err.status', (done) => {
        err = new HandlerError(new Error('raw error'), 'message', 403);
        const response = request(app)
            .get('/')
            .expect(403, done);
    });

    it('sets status to 500 if no status is specified', (done) => {
        err = new HandlerError(new Error('raw error'), 'message');
        request(app)
            .get('/')
            .expect(500, done);
    });

    it('responds with custom message from error', (done) => {
        err = new HandlerError(new Error('raw error'), 'message', 403);
        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.text).toEqual('message');
                done();
            })
    })
})

