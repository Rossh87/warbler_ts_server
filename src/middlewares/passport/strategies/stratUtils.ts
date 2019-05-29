//  function to substitute the name of an existing property
// on an object with the string of one's choice.  Returns a new object.

// Define acceptable in/output for reducer function
interface IReduceSignature {
    [key: string]: string | number
}

interface ITargetSignature {
    [key: string]: any
}

export const replacePropName =
(target: ITargetSignature, prevName: string, newName: string): IReduceSignature | never => {
    const propKeys = Object.keys(target);

    // throw if property prevName does not exist on target object
    if(propKeys.indexOf(prevName) === -1) {
        throw new Error (`Property ${prevName} does not exist on target object`);
    };

    return propKeys.reduce<IReduceSignature>((output, key) => {
        key === prevName ? 
            output[newName] = target[key]
            :
            output[key] = target[key];

        return output;
    }, {})
};