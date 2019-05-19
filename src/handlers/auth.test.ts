import {ensureAuthenticated} from './auth';

afterEach(() => jest.clearAllMocks());

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
};
const next = jest.fn();

describe('authorization middleware fn', () => {

    

    it('calls next without params if user property is present on request', () => {
        const req = {
            user: 'somestring'
        };

        ensureAuthenticated(req, res, next);
        expect(next.mock.calls[0][0]).toBe(undefined);
    });

    it('responds with a 401 if user property is not present on request', () => {
        const req = {
            someProp: 'string'
        };

        ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Authorization required'));
    })
})