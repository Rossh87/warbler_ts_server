import * as controller from './';

import {testDBController} from '../testUtils';

import {getMessages} from './';

const testController = new testDBController();

beforeEach(async() => {
    return await testController.clear();
});

afterAll(() => {
    return testController.closeConnection();
})

describe('the getMessages function', () => {
    it('returns an array of all messages in collection', async() => {
        await testController.genMockUsers(4).genMockMessages(4).saveData();

        const testMessages = await getMessages();
        return expect(testMessages.length).toEqual(testController.messages.length);
    })
})

