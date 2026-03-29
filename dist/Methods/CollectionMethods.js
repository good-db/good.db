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
exports.table = exports.has = exports.size = exports.type = exports.clear = exports.all = exports.values = exports.keys = exports.includes = exports.endsWith = exports.startsWith = void 0;
const good_db_1 = require("../good.db");
const ErrorMessage_1 = require("../utils/ErrorMessage");
/**
 * Collection Methods for GoodDB
 * Contains: startsWith, endsWith, includes, keys, values, all, clear, type, size, has, table
 */
/**
 * Get all the values that start with a key
 * @param key - The key to check if it starts with the value
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Get all the values that start with a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.startsWith('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.startsWith('key');
 * ```
 */
function startsWith(key, options) {
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
                    const keys = Object.keys(data);
                    const result = {};
                    for (const k of keys) {
                        if (k.startsWith(lastKey)) {
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
exports.startsWith = startsWith;
/**
 * Get all the values that end with a key
 * @param key - The key to check if it ends with the value
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Get all the values that end with a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.endsWith('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.endsWith('key');
 * ```
 */
function endsWith(key, options) {
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
exports.endsWith = endsWith;
/**
 * Get the values that include a key
 * @param key - The key to check if it includes the value
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Get the values that include a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.includes('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.includes('key');
 * ```
 */
function includes(key, options) {
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
        const keys = Object.keys(data);
        const result = {};
        for (const k of keys) {
            if (k.includes(lastKey)) {
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
            if (k.includes(key)) {
                result[k] = data[k];
            }
        }
        return result;
    }
}
exports.includes = includes;
/**
 * Get all the keys
 * @returns A promise if the driver is async, otherwise an array
 * @example Get all the keys
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.keys();
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.keys();
 * ```
 */
function keys() {
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
exports.keys = keys;
/**
 * Get all the values
 * @returns A promise if the driver is async, otherwise an array
 * @example Get all the values
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.values();
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.values();
 * ```
 */
function values() {
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
exports.values = values;
/**
 * Get all the keys and values
 * @returns A promise if the driver is async, otherwise an object
 * @example Get all the keys and values
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.all();
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.all();
 * ```
 */
function all(type = 'object') {
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
                    return resolve(Object.fromEntries(data
                        .map(({ key, value }) => {
                        if (!key)
                            return;
                        return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                    })
                        .filter(Boolean)));
                }
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
            return Object.fromEntries(data
                .map(({ key, value }) => {
                if (!key)
                    return;
                return [key, typeof value !== 'string' ? value : JSON.parse(value)];
            })
                .filter(Boolean));
        }
    }
}
exports.all = all;
/**
 * Clear the database
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Clear the database
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.clear();
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.clear();
 * ```
 */
function clear() {
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
exports.clear = clear;
/**
 * Get the type of a key
 * @param key - The key to get the type of
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a string
 * @example Get the type of a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.type('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.type('key');
 * ```
 */
function type(key, options) {
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
exports.type = type;
/**
 * Get the size of a key
 * @param key - The key to get the size of
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Get the size of a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.size('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.size('key');
 * ```
 */
function size(key, options) {
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
exports.size = size;
/**
 * Check if a key exists
 * @param key - The key to check if it exists
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Check if a key exists
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.has('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.has('key');
 * ```
 */
function has(key, options) {
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
exports.has = has;
/**
 * Make table for the database
 * @param name - The name of the tableName
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Make tableName for the database
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.table('tableName');
 * ```
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.table('tableName');
 * ```
 */
function table(name) {
    if (!name)
        throw new ErrorMessage_1.DatabaseError('Table name is required.');
    if (this.isAsync) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.driver.createTable(name);
                resolve(new good_db_1.GoodDB(this.driver, Object.assign(Object.assign({}, this.options), { table: name })));
            }
            catch (error) {
                reject(new Error(error));
            }
        }));
    }
    else {
        this.driver.createTable(name);
        return new good_db_1.GoodDB(this.driver, Object.assign(Object.assign({}, this.options), { table: name }));
    }
}
exports.table = table;
//# sourceMappingURL=CollectionMethods.js.map