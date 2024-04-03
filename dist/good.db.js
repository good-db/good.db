"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo_1 = require("./Drivers/Mongo");
<<<<<<< Updated upstream
=======
const MySQL_1 = require("./Drivers/MySQL");
const PostgreSQL_1 = require("./Drivers/PostgreSQL");
const SQLite_1 = require("./Drivers/SQLite");
>>>>>>> Stashed changes
const ErrorMessage_1 = require("./utils/ErrorMessage");
const nested_1 = require("./utils/nested");
/**
 * The main class for the GoodDB package
 * @example
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new new JSONDriver({
 *         path: './database.json'
 * }));
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 *       uri: "..."
 * }));
 * await db.connect();
 * ```
 */
class GoodDB {
    constructor(driver, options) {
        this.options = options;
        this.driver = driver;
        this.nested = {
            nested: (options === null || options === void 0 ? void 0 : options.nested) || '..',
            isEnabled: (options === null || options === void 0 ? void 0 : options.nestedIsEnabled) ? true : false,
        };
<<<<<<< Updated upstream
        this.isAsync = this.driver instanceof Mongo_1.MongoDBDriver ? true : false;
=======
        this.tableName = (options === null || options === void 0 ? void 0 : options.table) || 'gooddb';
        this.isAsync = this.driver instanceof Mongo_1.MongoDBDriver || this.driver instanceof PostgreSQL_1.PostgreSQLDriver || this.driver instanceof MySQL_1.MySQLDriver ? true : false;
>>>>>>> Stashed changes
        if (!this.isAsync) {
            this.driver.init();
        }
        ;
    }
    ;
    set(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const newData = (0, nested_1.setValueAtPath)(yield this.driver.read(), key, value, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.write(newData);
                        resolve(true);
                    }
                    else {
                        const data = yield this.driver.read();
                        data[key] = value;
                        yield this.driver.write(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            if (options === null || options === void 0 ? void 0 : options.nested) {
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const data = (0, nested_1.getValueAtPath)(yield this.driver.read(), key, {
                            separator: this.nested.nested,
                        });
                        return resolve(data);
                    }
                    else {
                        const data = yield this.driver.read();
                        return resolve(data[key]);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
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
    delete(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const data = (0, nested_1.deleteValueAtPath)(this.driver.read(), key, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.write(data);
                        resolve(true);
                    }
                    else {
                        const data = yield this.driver.read();
                        delete data[key];
                        yield this.driver.write(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                const data = (0, nested_1.deleteValueAtPath)(this.driver.read(), key, {
                    separator: options === null || options === void 0 ? void 0 : options.nested,
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
    push(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.push(value);
                    yield this.set(key, data, options);
                    resolve(data.length);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
<<<<<<< Updated upstream
            if (!Array.isArray(data) && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
=======
>>>>>>> Stashed changes
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
    shift(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        resolve(undefined);
                    }
                    const value = data.shift();
                    yield this.set(key, data, options);
                    resolve(value);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                return undefined;
            }
            const value = data.shift();
            this.set(key, data, options);
            return value;
        }
    }
    ;
    unshift(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.unshift(value);
                    yield this.set(key, data, options);
                    resolve(data.length);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
            data.unshift(value);
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key);
                    console.log(data, 'aadada');
                    if (!data) {
                        resolve(false);
                    }
                    const pullFromArray = (array) => __awaiter(this, void 0, void 0, function* () {
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
                            yield this.set(key, data, options);
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    const pullFromNestedObject = (currentObject, keyParts, depth) => __awaiter(this, void 0, void 0, function* () {
                        const part = keyParts[depth];
                        if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                            throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                        }
                        if (depth === keyParts.slice(1).length) {
                            return yield pullFromArray(currentObject[part]);
                        }
                        else {
                            const updated = yield pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                            if (updated) {
                                yield this.set(key, data, options);
                            }
                            return updated;
                        }
                    });
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const keyParts = key.split(options.nested);
                        yield pullFromNestedObject(data, keyParts, 0);
                        resolve(true);
                    }
                    else {
                        if (!Array.isArray(data)) {
                            throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        yield pullFromArray(data);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
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
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) + value;
                    yield this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    multiply(key, value, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 1) * value;
                    yield this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not a number');
            }
            const newValue = (data || 1) * value;
            this.set(key, newValue, options);
            return newValue;
        }
    }
    ;
    double(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 1) * 2;
                    yield this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not a number');
            }
            const newValue = (data || 1) * 2;
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new ErrorMessage_1.DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) - value;
                    yield this.set(key, newValue, options);
                    resolve(newValue);
                }
                catch (error) {
                    reject(error);
                }
            }));
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
    type(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (data === null || data === undefined) {
                        resolve('null');
                    }
                    else if (typeof data === 'string') {
                        resolve('string');
                    }
                    else if (typeof data === 'number') {
                        resolve('number');
                    }
                    else if (typeof data === 'boolean') {
                        resolve('boolean');
                    }
                    else if (Array.isArray(data)) {
                        resolve('array');
                    }
                    else if (typeof data === 'object') {
                        resolve('object');
                    }
                    else {
                        resolve('unknown');
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (data === null || data === undefined) {
                return 'null';
            }
            else if (typeof data === 'string') {
                return 'string';
            }
            else if (typeof data === 'number') {
                return 'number';
            }
            else if (typeof data === 'boolean') {
                return 'boolean';
            }
            else if (Array.isArray(data)) {
                return 'array';
            }
            else if (typeof data === 'object') {
                return 'object';
            }
            else {
                return 'unknown';
            }
        }
    }
    ;
    size(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (data === null || data === undefined) {
                        resolve(0);
                    }
                    else if (typeof data === 'string') {
                        resolve(data.length);
                    }
                    else if (Array.isArray(data)) {
                        resolve(data.length);
                    }
                    else if (typeof data === 'object') {
                        resolve(Object.keys(data).length);
                    }
                    else {
                        resolve(0);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (data === null || data === undefined) {
                return 0;
            }
            else if (typeof data === 'string') {
                return data.length;
            }
            else if (Array.isArray(data)) {
                return data.length;
            }
            else if (typeof data === 'object') {
                return Object.keys(data).length;
            }
            else {
                return 0;
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const value = yield this.get(key, options);
                    resolve(value !== null && value !== undefined);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            return this.get(key, options) ? true : false;
        }
    }
    ;
    startsWith(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = yield this.get(k, options);
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
                        const data = yield this.driver.read();
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
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
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
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = yield this.get(k, options);
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
                        const data = yield this.driver.read();
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
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
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
    includes(key, options) {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = yield this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.includes(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                    else {
                        const data = yield this.driver.read();
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.includes(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                const data = this.get(k, options);
                if (typeof data !== 'object') {
                    throw new ErrorMessage_1.DatabaseError('Value is not an object');
                }
                ;
                const keys = Object.keys(data);
                const result = {};
                for (const k of keys) {
                    if (k.includes(key)) {
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
                    if (k.includes(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
        }
    }
    ;
    keys() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.driver.read();
                    resolve(Object.keys(data));
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.driver.read();
            return Object.keys(data);
        }
    }
    ;
    values() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.driver.read();
                    resolve(Object.values(data));
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.driver.read();
            return Object.values(data);
        }
    }
    ;
    all() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.driver.read();
                    resolve(data);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            return this.driver.read();
        }
    }
    ;
    clear() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.driver.clear();
                    resolve(true);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            this.driver.clear();
            return true;
        }
    }
    ;
    // End Collection methods //
    // Async methods //
    /**
     * Connect to the database
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Connect to the database
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     * ```
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
<<<<<<< Updated upstream
            if (this.driver instanceof Mongo_1.MongoDBDriver) {
                return yield this.driver.init();
=======
            if (this.driver instanceof Mongo_1.MongoDBDriver || this.driver instanceof PostgreSQL_1.PostgreSQLDriver || this.driver instanceof MySQL_1.MySQLDriver) {
                return yield this.driver.init(this.tableName);
>>>>>>> Stashed changes
            }
            else {
                throw new ErrorMessage_1.DatabaseError('This driver does not support the connect method');
            }
        });
    }
    ;
    /**
     * Disconnect from the database
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Disconnect from the database
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.disconnect();
     * ```
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.driver instanceof Mongo_1.MongoDBDriver || this.driver instanceof PostgreSQL_1.PostgreSQLDriver || this.driver instanceof MySQL_1.MySQLDriver) {
                return yield this.driver.close();
            }
            else {
                throw new ErrorMessage_1.DatabaseError('This driver does not support the disconnect method');
            }
        });
    }
    ;
}
exports.default = GoodDB;
;
//# sourceMappingURL=good.db.js.map