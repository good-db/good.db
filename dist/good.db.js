"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo_1 = require("./Drivers/Mongo");
const ErrorMessage_1 = require("./utils/ErrorMessage");
const nested_1 = require("./utils/nested");
class GoodDB {
    driver;
    nested;
    isAsync;
    constructor(driver, options) {
        this.driver = driver;
        this.nested = {
            nested: options?.nested || '..',
            isEnabled: options?.nestedIsEnabled ? true : false,
        };
        this.isAsync = this.driver instanceof Mongo_1.MongoDBDriver ? true : false;
        this.driver.init();
    }
    ;
    set(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const newData = (0, nested_1.setValueAtPath)(this.driver.read(), key, value, {
                            separator: options?.nested,
                        });
                        await this.driver.write(newData);
                        resolve(true);
                    }
                    else {
                        const data = await this.driver.read();
                        data[key] = value;
                        await this.driver.write(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            if (options?.nested) {
                const newData = (0, nested_1.setValueAtPath)(this.driver.read(), key, value, {
                    separator: this.nested.nested,
                });
                this.driver.write(newData);
                return true;
            }
            else {
                const data = this.driver.read();
                data[key] = value;
                this.driver.write(data);
                return true;
            }
        }
    }
    ;
    get(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const data = (0, nested_1.getValueAtPath)(await this.driver.read(), key, {
                            separator: this.nested.nested,
                        });
                        return resolve(data);
                    }
                    else {
                        const data = await this.driver.read();
                        return resolve(data[key]);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                return (0, nested_1.getValueAtPath)(this.driver.read(), key, {
                    separator: this.nested.nested,
                });
            }
            else {
                return this.driver.read()[key];
            }
        }
    }
    ;
    has(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const value = await this.get(key, options);
                    resolve(value !== null && value !== undefined);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            return this.get(key, options) ? true : false;
        }
    }
    ;
    math(key, mathSign, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => {
                try {
                    let data = this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    switch (mathSign) {
                        case '+':
                            data = (data || 0) + value;
                            break;
                        case '-':
                            data = (data || 0) - value;
                            break;
                        case '*':
                        case '×':
                            data = (data || 1) * value;
                            break;
                        case '/':
                            if (value === 0) {
                                throw new ErrorMessage_1.DatabaseError('Cannot divide by zero');
                            }
                            data = (data || 0) / value;
                            break;
                        default:
                            throw new ErrorMessage_1.DatabaseError('Invalid math sign');
                    }
                    this.set(key, data, options)
                        .then(() => resolve(data))
                        .catch((error) => reject(error));
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            try {
                let data = this.get(key, options);
                if (typeof data !== 'number' && data !== undefined) {
                    throw new ErrorMessage_1.DatabaseError('Value is not a number');
                }
                switch (mathSign) {
                    case '+':
                        data = (data || 0) + value;
                        break;
                    case '-':
                        data = (data || 0) - value;
                        break;
                    case '*':
                    case '×':
                        data = (data || 1) * value;
                        break;
                    case '/':
                        if (value === 0) {
                            throw new ErrorMessage_1.DatabaseError('Cannot divide by zero');
                        }
                        data = (data || 0) / value;
                        break;
                    default:
                        throw new ErrorMessage_1.DatabaseError('Invalid math sign');
                }
                this.set(key, data, options);
                return data;
            }
            catch (error) {
                throw error;
            }
        }
    }
    ;
    startsWith(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const k = key.split(options?.nested).slice(0, -1).join(options?.nested);
                        const data = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                    else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                const k = key.split(options?.nested).slice(0, -1).join(options?.nested);
                const data = this.get(k, options);
                if (typeof data !== 'object') {
                    throw new ErrorMessage_1.DatabaseError('Value is not an object');
                }
                ;
                const keys = Object.keys(data);
                const result = {};
                for (const k of keys) {
                    if (k.startsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
            else {
                const data = this.driver.read();
                const keys = Object.keys(data);
                const result = {};
                for (const k of keys) {
                    if (k.startsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
        }
    }
    ;
    endsWith(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const k = key.split(options?.nested).slice(0, -1).join(options?.nested);
                        const data = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                    else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                const k = key.split(options?.nested).slice(0, -1).join(options?.nested);
                const data = this.get(k, options);
                if (typeof data !== 'object') {
                    throw new ErrorMessage_1.DatabaseError('Value is not an object');
                }
                ;
                const keys = Object.keys(data);
                const result = {};
                for (const k of keys) {
                    if (k.endsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
            else {
                const data = this.driver.read();
                const keys = Object.keys(data);
                const result = {};
                for (const k of keys) {
                    if (k.endsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
        }
    }
    ;
    push(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.push(value);
                    await this.set(key, data, options);
                    resolve(data.length);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
            }
            data.push(value);
            this.set(key, data, options);
            return data.length;
        }
    }
    ;
    pull(key, valueOrCallback, pullAll, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (!key) {
            throw new ErrorMessage_1.DatabaseError("The key is not defined!");
        }
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key);
                    console.log(data, 'aadada');
                    if (!data) {
                        resolve(false);
                    }
                    const pullFromArray = async (array) => {
                        const indexesToRemove = [];
                        let removed = false;
                        array.forEach((element, index) => {
                            if (!removed && !pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                }
                                else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                }
                            }
                            else if (pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                }
                                else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                }
                            }
                        });
                        if (indexesToRemove.length > 0) {
                            for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                                array.splice(indexesToRemove[i], 1);
                            }
                            await this.set(key, data, options);
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    const pullFromNestedObject = async (currentObject, keyParts, depth) => {
                        const part = keyParts[depth];
                        if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                            throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                        }
                        if (depth === keyParts.slice(1).length) {
                            return await pullFromArray(currentObject[part]);
                        }
                        else {
                            const updated = await pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                            if (updated) {
                                await this.set(key, data, options);
                            }
                            return updated;
                        }
                    };
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const keyParts = key.split(options.nested);
                        await pullFromNestedObject(data, keyParts, 0);
                        resolve(true);
                    }
                    else {
                        if (!Array.isArray(data)) {
                            throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        await pullFromArray(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            const data = this.get(key);
            if (!data) {
                return false;
            }
            const pullFromArray = (array) => {
                const indexesToRemove = [];
                let removed = false;
                array.forEach((element, index) => {
                    if (!removed && !pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                            removed = true;
                        }
                        else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                            removed = true;
                        }
                    }
                    else if (pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                        }
                        else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                        }
                    }
                });
                if (indexesToRemove.length > 0) {
                    for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                        array.splice(indexesToRemove[i], 1);
                    }
                    this.set(key, data, options);
                    return true;
                }
                return false;
            };
            const pullFromNestedObject = (currentObject, keyParts, depth) => {
                const part = keyParts[depth];
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                }
                if (depth === keyParts.slice(1).length) {
                    return pullFromArray(currentObject[part]);
                }
                else {
                    const updated = pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                    if (updated) {
                        this.set(key, data, options);
                    }
                    return updated;
                }
            };
            if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                const keyParts = key.split(options.nested);
                return pullFromNestedObject(data, keyParts, 0);
            }
            else {
                if (!Array.isArray(data)) {
                    throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }
                return pullFromArray(data);
            }
        }
    }
    ;
    add(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) + value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) + value;
            this.set(key, newValue, options);
            return newValue;
        }
    }
    ;
    subtract(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) - value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) - value;
            this.set(key, newValue, options);
            return newValue;
        }
    }
    ;
    delete(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                        const data = (0, nested_1.deleteValueAtPath)(this.driver.read(), key, {
                            separator: options?.nested,
                        });
                        await this.driver.write(data);
                        resolve(true);
                    }
                    else {
                        const data = await this.driver.read();
                        delete data[key];
                        await this.driver.write(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            if (options?.nestedIsEnabled && key.includes(options?.nested)) {
                const data = (0, nested_1.deleteValueAtPath)(this.driver.read(), key, {
                    separator: options?.nested,
                });
                this.driver.write(data);
                return true;
            }
            else {
                const data = this.driver.read();
                delete data[key];
                this.driver.write(data);
                return true;
            }
        }
    }
    ;
    all() {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.driver.read();
                    resolve(data);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            return this.driver.read();
        }
    }
    ;
    clear() {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.driver.clear();
                    resolve(true);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else {
            this.driver.clear();
            return true;
        }
    }
    ;
}
exports.default = GoodDB;
;
//# sourceMappingURL=good.db.js.map