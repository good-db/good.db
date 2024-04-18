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
const MySQL_1 = require("./Drivers/MySQL");
const PostgreSQL_1 = require("./Drivers/PostgreSQL");
const SQLite_1 = require("./Drivers/SQLite");
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
        this.driver = driver || new SQLite_1.SQLiteDriver({
            path: './database.sqlite'
        });
        this.nested = {
            nested: (options === null || options === void 0 ? void 0 : options.nested) || '..',
            isEnabled: (options === null || options === void 0 ? void 0 : options.nestedIsEnabled) ? true : false,
        };
        this.tableName = (options === null || options === void 0 ? void 0 : options.table) || 'gooddb';
        this.isAsync = this.driver instanceof Mongo_1.MongoDBDriver || this.driver instanceof PostgreSQL_1.PostgreSQLDriver || this.driver instanceof MySQL_1.MySQLDriver ? true : false;
        if (!this.isAsync) {
            this.driver.init(this.tableName);
        }
        ;
    }
    ;
    get getNestedOptions() {
        var _a, _b;
        return {
            nested: (_a = this.nested.nested) !== null && _a !== void 0 ? _a : '..',
            nestedIsEnabled: (_b = this.nested.isEnabled) !== null && _b !== void 0 ? _b : false,
        };
    }
    ;
    set(key, value, options) {
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
        options = options || this.getNestedOptions;
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const newData = (0, nested_1.setValueAtPath)(yield this.driver.getAllRows(this.tableName), key, value, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.setRowByKey(this.tableName, newData.key, newData.currentObject);
                        resolve(true);
                    }
                    else {
                        yield this.driver.setRowByKey(this.tableName, key, value);
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
                const newData = (0, nested_1.setValueAtPath)(this.driver.getAllRows(this.tableName), key, value, {
                    separator: this.nested.nested,
                });
                this.driver.setRowByKey(this.tableName, newData.key, newData.currentObject);
                return true;
            }
            else {
                this.driver.setRowByKey(this.tableName, key, value);
                return true;
            }
        }
    }
    ;
    get(key, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const data = (0, nested_1.getValueAtPath)(yield this.driver.getAllRows(this.tableName), key, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        return resolve(data.value);
                    }
                    else {
                        const data = yield this.driver.getRowByKey(this.tableName, key);
                        return resolve(data);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                const data = (0, nested_1.getValueAtPath)(this.driver.getAllRows(this.tableName), key, {
                    separator: options === null || options === void 0 ? void 0 : options.nested,
                });
                return data.value;
            }
            else {
                return this.driver.getRowByKey(this.tableName, key);
            }
        }
    }
    ;
    delete(key, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const data = (0, nested_1.deleteValueAtPath)(yield this.driver.getAllRows(this.tableName), key, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.setRowByKey(this.tableName, data.key, data.currentObject);
                        resolve(true);
                    }
                    else {
                        yield this.driver.deleteRowByKey(this.tableName, key);
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
                const data = (0, nested_1.deleteValueAtPath)(this.driver.getAllRows(this.tableName), key, {
                    separator: options === null || options === void 0 ? void 0 : options.nested,
                });
                this.driver.setRowByKey(this.tableName, data.key, data.currentObject);
                return true;
            }
            else {
                this.driver.deleteRowByKey(this.tableName, key);
                return true;
            }
        }
    }
    ;
    push(key, value, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
            }
            if (!Array.isArray(data) && data !== undefined) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
            data.push(value);
            this.set(key, data, options);
            return data.length;
        }
    }
    ;
    shift(key, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
    pop(key, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
                    const value = data.pop();
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
            const value = data.pop();
            this.set(key, data, options);
            return value;
        }
    }
    ;
    pull(key, valueOrCallback, pullAll, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
        if (!key) {
            throw new ErrorMessage_1.DatabaseError("The key is not defined!");
        }
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
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
            const data = this.get(key, options);
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
    find(key, callback, options) {
        options = options || this.getNestedOptions;
        if (typeof callback !== 'function')
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires the callback to be a function. Provided: ${typeof callback}`);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!Array.isArray(data)) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    resolve(data.find(callback));
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (!Array.isArray(data)) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
            return data.find(callback);
        }
    }
    ;
    add(key, value, options) {
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let data = yield this.get(key, options);
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
            }));
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
        options = options || this.getNestedOptions;
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
                        const data = yield this.driver.getAllRows(this.tableName);
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
                const data = this.driver.getAllRows(this.tableName);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
                        const data = yield this.driver.getAllRows(this.tableName);
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
                const data = this.driver.getAllRows(this.tableName);
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
        options = options || this.getNestedOptions;
        if (typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${!(key === null || key === void 0 ? void 0 : key.trim()) ? 'Null' : typeof key}`);
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
                        const data = yield this.driver.getAllRows(this.tableName);
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
                const data = this.driver.getAllRows(this.tableName);
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
                    const data = yield this.driver.getAllRows(this.tableName);
                    resolve(Object.keys(data));
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.driver.getAllRows(this.tableName);
            return Object.keys(data);
        }
    }
    ;
    values() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.driver.getAllRows(this.tableName);
                    resolve(Object.values(data));
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            const data = this.driver.getAllRows(this.tableName);
            return Object.values(data);
        }
    }
    ;
    all() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.driver.getAllRows(this.tableName);
                    resolve(data);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            return this.driver.getAllRows(this.tableName);
        }
    }
    ;
    clear() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.driver.deleteAllRows(this.tableName);
                    resolve(true);
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
        else {
            this.driver.deleteAllRows(this.tableName);
            return true;
        }
    }
    ;
    /**
     * Make table for the database
     * @param name - The name of the tableName
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Make tableName for the database
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * await db.connect();
     * await db.table('tableName');
     * ```
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *   path: './database.json'
     * }));
     * db.table('tableName');
     * ```
     */
    table(name) {
        if (!name)
            throw new ErrorMessage_1.DatabaseError('Table name is required.');
        return new GoodDB(this.driver, Object.assign(Object.assign({}, this.options), { table: name }));
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
            if (this.driver instanceof Mongo_1.MongoDBDriver || this.driver instanceof PostgreSQL_1.PostgreSQLDriver || this.driver instanceof MySQL_1.MySQLDriver) {
                return yield this.driver.init(this.tableName);
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