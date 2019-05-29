import {replacePropName} from './stratUtils';

describe('the function replacePropName', () => {
    it('replaces property "id" on an object with the specified string', () => {
        const input = {
            photos: ['url1', 'url2'],
            name: {
                familyName: 'Ross',
                givenName: 'Hunter'
            },
            id: '123adfafs1'
        };

        const expected = {
            photos: ['url1', 'url2'],
            name: {
                familyName: 'Ross',
                givenName: 'Hunter'
            },
            providerID: '123adfafs1'
        };

        expect(replacePropName(input, 'id', 'providerID')).toEqual(expected);
    });

    it('throws if property for replacement does not exist on target object', () => {
        const shouldThrow = {
            prop1: 'someString'
        };

        expect(() => replacePropName(shouldThrow, 'badProp', 'newProp')).toThrow();
    })
})