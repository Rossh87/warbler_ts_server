"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stratUtils_1 = require("./stratUtils");
describe('the function replacePropName', function () {
    it('replaces property "id" on an object with the specified string', function () {
        var input = {
            photos: ['url1', 'url2'],
            name: {
                familyName: 'Ross',
                givenName: 'Hunter'
            },
            id: '123adfafs1'
        };
        var expected = {
            photos: ['url1', 'url2'],
            name: {
                familyName: 'Ross',
                givenName: 'Hunter'
            },
            providerID: '123adfafs1'
        };
        expect(stratUtils_1.replacePropName(input, 'id', 'providerID')).toEqual(expected);
    });
    it('throws if property for replacement does not exist on target object', function () {
        var shouldThrow = {
            prop1: 'someString'
        };
        expect(function () { return stratUtils_1.replacePropName(shouldThrow, 'badProp', 'newProp'); }).toThrow();
    });
});
