import { DatabaseError } from "./ErrorMessage";

type SetValueOptions = {
    separator?: string;
};

export function setValueAtPath(object: any, key: string, value: any, options?: SetValueOptions): any {
    const { separator = '.' } = options || {};

    const keyParts = key.split(separator);

    let currentObject = object;
    for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];

        if (!currentObject[part]) {
            currentObject[part] = {};
        } else if (typeof currentObject[part] !== 'object') {
            throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
        }
        currentObject = currentObject[part];
    };

    const lastPart = keyParts[keyParts.length - 1];
    const isArrayIndex = !isNaN(parseInt(lastPart, 10));
    if (Array.isArray(currentObject) && !isArrayIndex) {
        throw new DatabaseError(`Cannot set value at '${key}' because '${lastPart}' is not a valid array index.`);
    };
    currentObject[lastPart] = value;

    return object;
};

export function getValueAtPath(object: any, key: string, options?: SetValueOptions): any {
    const { separator = '.' } = options || {};

    const keyParts = key.split(separator);

    let currentObject = object;
    for (let i = 0; i < keyParts.length; i++) {
        const part = keyParts[i];
        if (!currentObject[part]) {
            return undefined;
        } else if (i === keyParts.length - 1) {
            return currentObject[part];
        }
        currentObject = currentObject[part];
    };

    return currentObject;
};

export function deleteValueAtPath(object: any, key: string, options?: SetValueOptions): any {
    const { separator = '.' } = options || {};

    const keyParts = key.split(separator);

    let currentObject = object;
    for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];

        if (!currentObject[part]) {
            return object;
        } else if (i === keyParts.length - 1) {
            return object;
        }
        currentObject = currentObject[part];
    };

    const lastPart = keyParts[keyParts.length - 1];
    const isArrayIndex = !isNaN(parseInt(lastPart, 10));
    if (Array.isArray(currentObject) && !isArrayIndex) {
        throw new DatabaseError(`Cannot delete value at '${key}' because '${lastPart}' is not a valid array index.`);
    };
    delete currentObject[lastPart];

    return object;
};