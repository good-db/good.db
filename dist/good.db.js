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
const SQLite_1 = require("./Drivers/SQLite");
const ErrorMessage_1 = require("./utils/ErrorMessage");
const Caching_1 = require("./utils/Caching");
const nested_1 = require("./utils/nested");
const Utils_1 = require("./utils/Utils");
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
        var _a, _b, _c, _d;
        this.options = options;
        this.driver = driver || new SQLite_1.SQLiteDriver({
            path: './database.sqlite'
        });
        this.nested = {
            nested: (options === null || options === void 0 ? void 0 : options.nested) || '..',
            isEnabled: (options === null || options === void 0 ? void 0 : options.nestedIsEnabled) ? true : false,
        };
        this.tableName = (options === null || options === void 0 ? void 0 : options.table) || 'gooddb';
        this.isAsync = (0, Utils_1.checkDriverIsAsync)(this.driver);
        if (!this.isAsync) {
            this.driver.init(this.tableName);
        }
        ;
        this.cacheIsEnabled = (_b = (_a = options === null || options === void 0 ? void 0 : options.cache) === null || _a === void 0 ? void 0 : _a.isEnabled) !== null && _b !== void 0 ? _b : false;
        this.cacheService = this.cacheIsEnabled ? new Caching_1.LRUCache((_d = (_c = options === null || options === void 0 ? void 0 : options.cache) === null || _c === void 0 ? void 0 : _c.capacity) !== null && _d !== void 0 ? _d : 1024) : undefined;
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
    checkKey(key) {
        if (!key || typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim()))
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${(key === null || key === void 0 ? void 0 : key.trim()) ? typeof key : 'Null'}`);
    }
    ;
    set(key, value, options) {
        var _a, _b, _c, _d;
        this.checkKey(key);
        options = options || this.getNestedOptions;
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _e, _f, _g, _h;
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        // Split all keys
                        const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
                        // First key
                        const firstKey = splitKeys[0];
                        // Other keys
                        const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
                        // Get the data
                        const data = (_f = (_e = this.cacheService) === null || _e === void 0 ? void 0 : _e.get(firstKey)) !== null && _f !== void 0 ? _f : yield this.get(firstKey);
                        const newData = (0, nested_1.setValueAtPath)(data || {}, otherKeys, value, {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.setRowByKey(this.tableName, firstKey, newData.object);
                        (_g = this.cacheService) === null || _g === void 0 ? void 0 : _g.put(firstKey, newData.object);
                        resolve(true);
                    }
                    else {
                        yield this.driver.setRowByKey(this.tableName, key, value);
                        (_h = this.cacheService) === null || _h === void 0 ? void 0 : _h.put(key, value);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            // Split all keys
            const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
            // First key
            const firstKey = splitKeys[0];
            // Other keys
            const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
            // Get the data
            const data = (_b = (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.get(firstKey)) !== null && _b !== void 0 ? _b : this.get(firstKey);
            const newData = (0, nested_1.setValueAtPath)(data || {}, otherKeys, value, {
                separator: options === null || options === void 0 ? void 0 : options.nested,
            });
            this.driver.setRowByKey(this.tableName, firstKey, newData.object);
            (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.put(firstKey, newData.object);
            return true;
        }
        else {
            this.driver.setRowByKey(this.tableName, key, value);
            (_d = this.cacheService) === null || _d === void 0 ? void 0 : _d.put(key, value);
            return true;
        }
    }
    ;
    get(key, options) {
        var _a, _b, _c, _d, _e, _f;
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _g, _h, _j, _k, _l, _m;
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        // Split all keys
                        let [firstKey, ...otherKeys] = key.split(options === null || options === void 0 ? void 0 : options.nested);
                        // Get the data
                        const data = (_h = (_g = this.cacheService) === null || _g === void 0 ? void 0 : _g.get(firstKey)) !== null && _h !== void 0 ? _h : yield this.driver.getRowByKey(this.tableName, firstKey);
                        if (typeof data !== 'object' || !data) {
                            return resolve(undefined);
                        }
                        ;
                        // Get the value
                        const getData = (0, nested_1.getValueAtPath)(data || {}, otherKeys.join(options === null || options === void 0 ? void 0 : options.nested), {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        (_j = this.cacheService) === null || _j === void 0 ? void 0 : _j.put(firstKey, getData.object);
                        return resolve(getData.value);
                    }
                    else {
                        const data = (_l = (_k = this.cacheService) === null || _k === void 0 ? void 0 : _k.get(key)) !== null && _l !== void 0 ? _l : yield this.driver.getRowByKey(this.tableName, key);
                        (_m = this.cacheService) === null || _m === void 0 ? void 0 : _m.put(key, data);
                        return resolve(data);
                    }
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            // Split all keys
            const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
            // First key
            const firstKey = splitKeys[0];
            // Other keys
            const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
            // Get the data
            const data = (_b = (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.get(firstKey)) !== null && _b !== void 0 ? _b : this.driver.getRowByKey(this.tableName, firstKey);
            if (typeof data !== 'object' || !data) {
                return undefined;
            }
            ;
            // Get the value
            const getData = (0, nested_1.getValueAtPath)(data || {}, otherKeys, {
                separator: options === null || options === void 0 ? void 0 : options.nested,
            });
            (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.put(firstKey, getData.object);
            return getData.value;
        }
        else {
            const data = (_e = (_d = this.cacheService) === null || _d === void 0 ? void 0 : _d.get(key)) !== null && _e !== void 0 ? _e : this.driver.getRowByKey(this.tableName, key);
            (_f = this.cacheService) === null || _f === void 0 ? void 0 : _f.put(key, data);
            return data;
        }
    }
    ;
    delete(key, options) {
        var _a, _b;
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _c, _d;
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        // Split all keys
                        const [firstKey, ...otherKeys] = key.split(options === null || options === void 0 ? void 0 : options.nested);
                        // Get the data
                        const data = yield this.get(firstKey);
                        const deleteData = (0, nested_1.deleteValueAtPath)(data || {}, otherKeys.join(options.nested), {
                            separator: options === null || options === void 0 ? void 0 : options.nested,
                        });
                        yield this.driver.setRowByKey(this.tableName, firstKey, deleteData.object);
                        (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.put(firstKey, deleteData.object);
                        resolve(true);
                    }
                    else {
                        yield this.driver.deleteRowByKey(this.tableName, key);
                        (_d = this.cacheService) === null || _d === void 0 ? void 0 : _d.delete(key);
                        resolve(true);
                    }
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            const [firstKey, ...otherKeys] = key.split(options === null || options === void 0 ? void 0 : options.nested);
            const data = this.get(firstKey);
            const deleteDate = (0, nested_1.deleteValueAtPath)(data || {}, otherKeys.join(options.nested), {
                separator: options === null || options === void 0 ? void 0 : options.nested,
            });
            this.driver.setRowByKey(this.tableName, firstKey, deleteDate.object);
            (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.put(firstKey, deleteDate.object);
            return true;
        }
        else {
            this.driver.deleteRowByKey(this.tableName, key);
            (_b = this.cacheService) === null || _b === void 0 ? void 0 : _b.delete(key);
            return true;
        }
    }
    ;
    push(key, value, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
        if (!key) {
            throw new ErrorMessage_1.DatabaseError("The key is not defined!");
        }
        const pullFromArray = (array, data) => {
            const indexesToRemove = [];
            let removed = false;
            array.forEach((element, index) => {
                if ((typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) || element === valueOrCallback) {
                    indexesToRemove.push(index);
                    if (!pullAll && !removed) {
                        removed = true;
                    }
                }
                ;
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
        const pullFromNestedObject = (currentObject, keyParts, depth, data) => {
            const part = keyParts[depth];
            if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-object or non-array value at key '${part}'`);
            }
            if (depth === keyParts.slice(1).length) {
                return pullFromArray(currentObject[part], data);
            }
            else {
                const updated = pullFromNestedObject(currentObject[part], keyParts, depth + 1, data);
                if (updated) {
                    this.set(key, data, options);
                }
                return updated;
            }
        };
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!data) {
                        resolve(false);
                    }
                    ;
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        // const keyParts = key.split(options.nested as string);
                        resolve(pullFromArray(data, data));
                    }
                    else {
                        if (!Array.isArray(data)) {
                            throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        resolve(pullFromArray(data, data));
                    }
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (!data) {
                return false;
            }
            ;
            if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                // const keyParts = key.split(options.nested as string);
                return pullFromArray(data, data);
            }
            else {
                if (!Array.isArray(data)) {
                    throw new ErrorMessage_1.DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }
                return pullFromArray(data, data);
            }
        }
        ;
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
                    reject(new Error(error));
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
    distinct(key, value, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.get(key, options);
                    if (!Array.isArray(data)) {
                        throw new ErrorMessage_1.DatabaseError('Value is not an array');
                    }
                    let newData;
                    if (value !== undefined) {
                        if (typeof value === 'function') {
                            newData = data.filter(value);
                        }
                        else {
                            newData = data.filter((v, i, a) => a.indexOf(v) === i);
                        }
                        ;
                    }
                    else {
                        newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
                        newData = newData.map(item => JSON.parse(item));
                    }
                    ;
                    yield this.set(key, newData, options);
                    resolve(true);
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            const data = this.get(key, options);
            if (!Array.isArray(data)) {
                throw new ErrorMessage_1.DatabaseError('Value is not an array');
            }
            let newData;
            if (value !== undefined) {
                if (typeof value === 'function') {
                    newData = data.filter(value);
                }
                else {
                    newData = data.filter((v, i, a) => a.indexOf(v) === i);
                }
                ;
            }
            else {
                newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
                newData = newData.map(item => JSON.parse(item));
            }
            ;
            this.set(key, newData, options);
            return true;
        }
    }
    ;
    add(key, value, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                        .catch((error) => reject(new Error(error)));
                }
                catch (error) {
                    reject(new Error(error));
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
                throw new Error(error);
            }
        }
    }
    ;
    type(key, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
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
                    reject(new Error(error));
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
        this.checkKey(key);
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
                    reject(new Error(error));
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
                    reject(new Error(error));
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
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.startsWith(lastKey)) {
                                result[k] = data[k];
                            }
                        }
                        ;
                        resolve(result);
                    }
                    else {
                        const data = yield this.all();
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
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
            const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
            const data = this.get(k, options);
            if (typeof data !== 'object') {
                throw new ErrorMessage_1.DatabaseError('Value is not an object');
            }
            ;
            const keys = Object.keys(data);
            const result = {};
            for (const k of keys) {
                if (k.startsWith(lastKey)) {
                    result[k] = data[k];
                }
            }
            return result;
        }
        else {
            const data = this.all();
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
    ;
    endsWith(key, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = yield this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.endsWith(lastKey)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                    else {
                        const data = yield this.all();
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
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
            const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
            const data = this.get(k, options);
            if (typeof data !== 'object') {
                throw new ErrorMessage_1.DatabaseError('Value is not an object');
            }
            ;
            const keys = Object.keys(data);
            const result = {};
            for (const k of keys) {
                if (k.endsWith(lastKey)) {
                    result[k] = data[k];
                }
            }
            return result;
        }
        else {
            const data = this.all();
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
    ;
    includes(key, options) {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                        const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
                        const data = yield this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new ErrorMessage_1.DatabaseError('Value is not an object');
                        }
                        ;
                        const keys = Object.keys(data);
                        const result = {};
                        for (const k of keys) {
                            if (k.includes(lastKey)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                    else {
                        const data = yield this.all();
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
                    reject(new Error(error));
                }
            }));
        }
        else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
            const k = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(0, -1).join(options === null || options === void 0 ? void 0 : options.nested);
            const lastKey = key.split(options === null || options === void 0 ? void 0 : options.nested).slice(-1).join(options === null || options === void 0 ? void 0 : options.nested);
            const data = this.get(k, options);
            if (typeof data !== 'object') {
                throw new ErrorMessage_1.DatabaseError('Value is not an object');
            }
            ;
            const keys = Object.keys(data);
            const result = {};
            for (const k of keys) {
                if (k.includes(lastKey)) {
                    result[k] = data[k];
                }
            }
            ;
            return result;
        }
        else {
            const data = this.all();
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
    ;
    keys() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.all();
                    resolve(Object.keys(data));
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            const data = this.all();
            return Object.keys(data);
        }
    }
    ;
    values() {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.all();
                    resolve(Object.values(data));
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            const data = this.all();
            return Object.values(data);
        }
    }
    ;
    all(type = 'object') {
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const [data, isObject] = yield this.driver.getAllRows(this.tableName);
                    if (type === 'array') {
                        if (isObject) {
                            return resolve(Object.entries(data)
                                .map(([key, value]) => {
                                if (!key)
                                    return;
                                return { key, value };
                            })
                                .filter(Boolean));
                        }
                        ;
                        return resolve(data
                            .map(({ key, value }) => {
                            if (!key)
                                return;
                            return { key: key, value: typeof value !== 'string' ? value : JSON.parse(value) };
                        })
                            .filter(Boolean));
                    }
                    else {
                        if (isObject) {
                            return resolve(data);
                        }
                        ;
                        return resolve(Object.fromEntries(data
                            .map(({ key, value }) => {
                            if (!key)
                                return;
                            return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                        })
                            .filter(Boolean)));
                    }
                    ;
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            const [data, isObject] = this.driver.getAllRows(this.tableName);
            if (type === 'array') {
                if (isObject) {
                    return Object.entries(data)
                        .map(([key, value]) => {
                        if (!key)
                            return;
                        return { key, value };
                    })
                        .filter(Boolean);
                }
                ;
                return data
                    .map(({ key, value }) => {
                    if (!key)
                        return;
                    return { key: key, value: typeof value !== 'string' ? value : JSON.parse(value) };
                })
                    .filter(Boolean);
            }
            else {
                if (isObject) {
                    return data;
                }
                ;
                return Object.fromEntries(data
                    .map(({ key, value }) => {
                    if (!key)
                        return;
                    return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                })
                    .filter(Boolean));
            }
            ;
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
                    reject(new Error(error));
                }
            }));
        }
        else {
            this.driver.deleteAllRows(this.tableName);
            return true;
        }
    }
    ;
    table(name) {
        if (!name)
            throw new ErrorMessage_1.DatabaseError('Table name is required.');
        if (this.isAsync) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.driver.createTable(name);
                    resolve(new GoodDB(this.driver, Object.assign(Object.assign({}, this.options), { table: name })));
                }
                catch (error) {
                    reject(new Error(error));
                }
            }));
        }
        else {
            this.driver.createTable(name);
            return new GoodDB(this.driver, Object.assign(Object.assign({}, this.options), { table: name }));
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
            if ((0, Utils_1.checkDriverIsAsync)(this.driver)) {
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
            if ((0, Utils_1.checkDriverIsAsync)(this.driver)) {
                return this.driver
                    .close();
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