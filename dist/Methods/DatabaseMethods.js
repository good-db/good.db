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
exports.deleteMany = exports.getMany = exports.setMany = exports.deleteKey = exports.get = exports.set = void 0;
const ErrorMessage_1 = require("../utils/ErrorMessage");
const nested_1 = require("../utils/nested");
/**
 * Database Methods for GoodDB
 * Contains: set, get, delete, setMany, getMany, deleteMany
 */
/**
 * Set a value to a key
 * @param key - The key to set the value to
 * @param value - The value to set
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Set a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.set('key', 'value');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.set('key', 'value');
 * ```
 */
function set(key, value, options) {
    var _a, _b, _c;
    this.checkKey(key);
    options = options || this.getNestedOptions;
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _d, _e, _f;
            try {
                if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                    const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
                    const firstKey = splitKeys[0];
                    const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
                    const cachedData = (_d = this.cacheService) === null || _d === void 0 ? void 0 : _d.get(firstKey);
                    const data = cachedData !== null && cachedData !== void 0 ? cachedData : yield this.driver.getRowByKey(this.tableName, firstKey);
                    const newData = (0, nested_1.setValueAtPath)(data || {}, otherKeys, value, { separator: options === null || options === void 0 ? void 0 : options.nested });
                    yield this.driver.setRowByKey(this.tableName, firstKey, newData.object);
                    (_e = this.cacheService) === null || _e === void 0 ? void 0 : _e.put(firstKey, newData.object);
                    resolve(true);
                }
                else {
                    yield this.driver.setRowByKey(this.tableName, key, value);
                    (_f = this.cacheService) === null || _f === void 0 ? void 0 : _f.put(key, value);
                    resolve(true);
                }
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
        const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
        const firstKey = splitKeys[0];
        const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
        const cachedData = (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.get(firstKey);
        const data = cachedData !== null && cachedData !== void 0 ? cachedData : this.driver.getRowByKey(this.tableName, firstKey);
        const newData = (0, nested_1.setValueAtPath)(data || {}, otherKeys, value, { separator: options === null || options === void 0 ? void 0 : options.nested });
        this.driver.setRowByKey(this.tableName, firstKey, newData.object);
        (_b = this.cacheService) === null || _b === void 0 ? void 0 : _b.put(firstKey, newData.object);
        return true;
    }
    else {
        this.driver.setRowByKey(this.tableName, key, value);
        (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.put(key, value);
        return true;
    }
}
exports.set = set;
/**
 * Get a value from a key
 * @param key - The key to get the value from
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Get a value from a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.get('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.get('key');
 * ```
 */
function get(key, options) {
    var _a, _b, _c, _d;
    options = options || this.getNestedOptions;
    this.checkKey(key);
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g, _h;
            try {
                if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                    const [firstKey, ...otherKeys] = key.split(options === null || options === void 0 ? void 0 : options.nested);
                    const cachedData = (_e = this.cacheService) === null || _e === void 0 ? void 0 : _e.get(firstKey);
                    const data = cachedData !== null && cachedData !== void 0 ? cachedData : yield this.driver.getRowByKey(this.tableName, firstKey);
                    if (typeof data !== 'object' || data === null) {
                        return resolve(undefined);
                    }
                    // Only cache if it wasn't already in cache and we got valid data
                    if (!cachedData && data) {
                        (_f = this.cacheService) === null || _f === void 0 ? void 0 : _f.put(firstKey, data);
                    }
                    const getData = (0, nested_1.getValueAtPath)(data, otherKeys.join(options === null || options === void 0 ? void 0 : options.nested), { separator: options === null || options === void 0 ? void 0 : options.nested });
                    return resolve(getData.value);
                }
                else {
                    const cachedData = (_g = this.cacheService) === null || _g === void 0 ? void 0 : _g.get(key);
                    const data = cachedData !== null && cachedData !== void 0 ? cachedData : yield this.driver.getRowByKey(this.tableName, key);
                    // Only cache if it wasn't already in cache and we got valid data
                    if (!cachedData && data !== undefined) {
                        (_h = this.cacheService) === null || _h === void 0 ? void 0 : _h.put(key, data);
                    }
                    return resolve(data);
                }
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
        const splitKeys = key.split(options === null || options === void 0 ? void 0 : options.nested);
        const firstKey = splitKeys[0];
        const otherKeys = splitKeys.slice(1).join(options === null || options === void 0 ? void 0 : options.nested);
        const cachedData = (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.get(firstKey);
        const data = cachedData !== null && cachedData !== void 0 ? cachedData : this.driver.getRowByKey(this.tableName, firstKey);
        if (typeof data !== 'object' || data === null) {
            return undefined;
        }
        // Only cache if it wasn't already in cache and we got valid data
        if (!cachedData && data) {
            (_b = this.cacheService) === null || _b === void 0 ? void 0 : _b.put(firstKey, data);
        }
        const getData = (0, nested_1.getValueAtPath)(data, otherKeys, { separator: options === null || options === void 0 ? void 0 : options.nested });
        return getData.value;
    }
    else {
        const cachedData = (_c = this.cacheService) === null || _c === void 0 ? void 0 : _c.get(key);
        const data = cachedData !== null && cachedData !== void 0 ? cachedData : this.driver.getRowByKey(this.tableName, key);
        // Only cache if it wasn't already in cache and we got valid data
        if (!cachedData && data !== undefined) {
            (_d = this.cacheService) === null || _d === void 0 ? void 0 : _d.put(key, data);
        }
        return data;
    }
}
exports.get = get;
/**
 * Delete a key
 * @param key - The key to delete
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Delete a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.delete('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.delete('key');
 * ```
 */
function deleteKey(key, options) {
    var _a, _b;
    options = options || this.getNestedOptions;
    this.checkKey(key);
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            try {
                if ((options === null || options === void 0 ? void 0 : options.nestedIsEnabled) && key.includes(options === null || options === void 0 ? void 0 : options.nested)) {
                    const [firstKey, ...otherKeys] = key.split(options === null || options === void 0 ? void 0 : options.nested);
                    const data = yield this.get(firstKey);
                    const deleteData = (0, nested_1.deleteValueAtPath)(data || {}, otherKeys.join(options.nested), { separator: options === null || options === void 0 ? void 0 : options.nested });
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
        const deleteDate = (0, nested_1.deleteValueAtPath)(data || {}, otherKeys.join(options.nested), { separator: options === null || options === void 0 ? void 0 : options.nested });
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
exports.deleteKey = deleteKey;
/**
 * Set multiple key-value pairs at once
 * @param data - An object with key-value pairs to set
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Set multiple key-value pairs
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.setMany({ key1: 'value1', key2: 'value2' });
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.setMany({ key1: 'value1', key2: 'value2' });
 * ```
 */
function setMany(data, options) {
    if (!data || typeof data !== 'object')
        throw new ErrorMessage_1.DatabaseError('Data must be a valid object');
    const keys = Object.keys(data);
    if (keys.length === 0)
        throw new ErrorMessage_1.DatabaseError('Data object cannot be empty');
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const key of keys) {
                    yield this.set(key, data[key], options);
                }
                resolve(true);
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else {
        for (const key of keys) {
            this.set(key, data[key], options);
        }
        return true;
    }
}
exports.setMany = setMany;
/**
 * Get multiple values by their keys at once
 * @param keys - An array of keys to get
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise an object with key-value pairs
 * @example Get multiple values
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.getMany(['key1', 'key2']);
 * // Returns: { key1: 'value1', key2: 'value2' }
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.getMany(['key1', 'key2']);
 * ```
 */
function getMany(keys, options) {
    if (!Array.isArray(keys))
        throw new ErrorMessage_1.DatabaseError('Keys must be an array');
    if (keys.length === 0)
        throw new ErrorMessage_1.DatabaseError('Keys array cannot be empty');
    const result = {};
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const key of keys) {
                    result[key] = yield this.get(key, options);
                }
                resolve(result);
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else {
        for (const key of keys) {
            result[key] = this.get(key, options);
        }
        return result;
    }
}
exports.getMany = getMany;
/**
 * Delete multiple keys at once
 * @param keys - An array of keys to delete
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Delete multiple keys
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.deleteMany(['key1', 'key2']);
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.deleteMany(['key1', 'key2']);
 * ```
 */
function deleteMany(keys, options) {
    if (!Array.isArray(keys))
        throw new ErrorMessage_1.DatabaseError('Keys must be an array');
    if (keys.length === 0)
        throw new ErrorMessage_1.DatabaseError('Keys array cannot be empty');
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const key of keys) {
                    yield this.delete(key, options);
                }
                resolve(true);
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else {
        for (const key of keys) {
            this.delete(key, options);
        }
        return true;
    }
}
exports.deleteMany = deleteMany;
//# sourceMappingURL=DatabaseMethods.js.map