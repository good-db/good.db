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
exports.math = exports.double = exports.multiply = exports.subtract = exports.add = void 0;
const ErrorMessage_1 = require("../utils/ErrorMessage");
/**
 * Math Methods for GoodDB
 * Contains: add, subtract, multiply, double, math
 */
/**
 * Add a value to a key
 * @param key - The key to add the value to
 * @param value - The value to add
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Add a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.add('key', 1);
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.add('key', 1);
 * ```
 */
function add(key, value, options) {
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
exports.add = add;
/**
 * Subtract a value from a key
 * @param key - The key to subtract the value from
 * @param value - The value to subtract
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Subtract a value from a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.subtract('key', 1);
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.subtract('key', 1);
 * ```
 */
function subtract(key, value, options) {
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
exports.subtract = subtract;
/**
 * Multiply a value to a key
 * @param key - The key to multiply the value to
 * @param value - The value to multiply
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Multiply a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.multiply('key', 2);
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.multiply('key', 2);
 * ```
 */
function multiply(key, value, options) {
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
exports.multiply = multiply;
/**
 * Double a value to a key
 * @param key - The key to double the value to
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Double a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.double('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.double('key');
 * ```
 */
function double(key, options) {
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
exports.double = double;
/**
 * Math operation on a key
 * @param key - The key to do the math operation on
 * @param mathSign - The math sign to use
 * @param value - The value to use in the math operation
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Do a math operation on a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.math('key', '+', 1);
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.math('key', '+', 1);
 * ```
 */
function math(key, mathSign, value, options) {
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
                yield this.set(key, data, options);
                resolve(data);
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
exports.math = math;
//# sourceMappingURL=MathMethods.js.map