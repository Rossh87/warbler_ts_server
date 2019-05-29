"use strict";
//  function to substitute the name of an existing property
// on an object with the string of one's choice.  Returns a new object.
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacePropName = function (target, prevName, newName) {
    var propKeys = Object.keys(target);
    // throw if property prevName does not exist on target object
    if (propKeys.indexOf(prevName) === -1) {
        throw new Error("Property " + prevName + " does not exist on target object");
    }
    ;
    return propKeys.reduce(function (output, key) {
        key === prevName ?
            output[newName] = target[key]
            :
                output[key] = target[key];
        return output;
    }, {});
};
