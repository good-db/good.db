import { GoodDB } from "../good.db";
import { MathSigns, methodOptions } from "../Types";
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
export declare function add(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number>;
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
export declare function subtract(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number>;
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
export declare function multiply(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number>;
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
export declare function double(this: GoodDB, key: string, options?: methodOptions): number | Promise<number>;
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
export declare function math(this: GoodDB, key: string, mathSign: MathSigns, value: number, options?: methodOptions): number | Promise<number>;
