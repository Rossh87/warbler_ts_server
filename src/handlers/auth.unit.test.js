import {ensureAuthenticated, ensureAuthorized} from './auth';

afterEach(() => jest.clearAllMocks());

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
};

const next = jest.fn();

describe('Authentication middleware fn', () => {

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
        expect(res.send).toHaveBeenCalledWith(expect.stringContaining('authentication required'));
    })
});

// describe('Authorization middleware fn', () => {

//     it('calls next without params if req.params._id does match req.user._id', () => {
//         const req = {
//             user: {
//                 _id: '123'
//             },

//             params: {
//                 _id: '123'
//             }
//         };

//         ensureAuthorized(req, res, next);
//         expect(next.mock.calls[0][0]).toBe(undefined);
//     });

//     it('responds with a 403 if user and request ids don\'t match', () => {
//         const req = {
//             user: {
//                 _id: '123'
//             },

//             params: {
//                 _id: '456'
//             }
//         };

//         ensureAuthorized(req, res, next);

//         expect(res.status).toHaveBeenCalledWith(403);
//         expect(res.send).toHaveBeenCalledWith(expect.stringContaining('FORBIDDEN'));
//     })
// });