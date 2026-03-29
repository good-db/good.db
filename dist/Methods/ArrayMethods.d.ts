import { GoodDB } from "../good.db";
import { AllTypes, methodOptions } from "../Types";
/**
 * Array Methods for GoodDB
 * Contains: push, shift, unshift, pop, pull, find, filter, findAndUpdate, findAndUpdateMany, distinct
 */
/**
 * Push a value to a key
 * @param key - The key to push the value to
 * @param value - The value to push
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Push a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.push('key', 'value');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.push('key', 'value');
 * ```
 */
export declare function push(this: GoodDB, key: string, value: any, options?: methodOptions): number | Promise<number>;
/**
 * Shift a value from a key
 * @param key - The key to shift the value from
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Shift a value from a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.shift('key');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.shift('key');
 * ```
 */
export declare function shift(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
/**
 * Unshift a value to a key
 * @param key - The key to unshift the value to
 * @param value - The value to unshift
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a number
 * @example Unshift a value to a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.unshift('key', 'value');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.unshift('key', 'value');
 * ```
 */
export declare function unshift(this: GoodDB, key: string, value: any, options?: methodOptions): number | Promise<number>;
/**
 * Pop a value from a key
 * @param key - The key to pop the value from
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Pop a value from a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.pop('key');
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.pop('key');
 * ```
 */
export declare function pop(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
/**
 * Pull a value from a key
 * @param key - The key to pull the value from
 * @param valueOrCallback - The value or callback to use to pull the value
 * @param pullAll - Whether to pull all the values or just the first
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Pull a value from a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 * db.pull('key', 'value');
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 * await db.connect();
 * await db.pull('key', 'value');
 * ```
 */
export declare function pull(this: GoodDB, key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean | Promise<boolean>;
/**
 * Find a key in a collection
 * @param key - The key to find in the collection
 * @param callback - The callback find function to use
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a value
 * @example Find a key in a collection
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 *
 * db.find('key', (value) => value === 'value');
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 *
 * await db.connect();
 *
 * await db.find('key', (value) => value === 'value');
 * ```
 */
export declare function find(this: GoodDB, key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any | Promise<any>;
/**
 * Filter values in an array stored in a key
 * @param key - The key of the array to filter
 * @param callback - The callback filter function to use
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise an array of filtered values
 * @example Filter values in an array
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 *
 * db.filter('users', (user) => user.age > 18);
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 *
 * await db.connect();
 *
 * await db.filter('users', (user) => user.age > 18);
 * ```
 */
export declare function filter(this: GoodDB, key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any[] | Promise<any[]>;
/**
 * Find a value in an array and update it
 * @param key - The key of the array to search
 * @param findCallback - The callback function to find the element
 * @param updateCallback - The callback function to update the found element
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise the updated element or undefined if not found
 * @example Find and update a value in an array
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 *
 * db.findAndUpdate('users',
 * (user) => user.id === 1,
 * (user) => { user.name = 'Updated Name'; return user; }
 * );
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 *
 * await db.connect();
 *
 * await db.findAndUpdate('users',
 * (user) => user.id === 1,
 * (user) => { user.name = 'Updated Name'; return user; }
 * );
 * ```
 */
export declare function findAndUpdate(this: GoodDB, key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions): any | Promise<any>;
/**
 * Find multiple values in an array and update them
 * @param key - The key of the array to search
 * @param findCallback - The callback function to find the elements
 * @param updateCallback - The callback function to update the found elements
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise an array of updated elements
 * @example Find and update multiple values in an array
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 *
 * db.findAndUpdateMany('users',
 * (user) => user.active === true,
 * (user) => { user.status = 'verified'; return user; }
 * );
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 *
 * await db.connect();
 *
 * await db.findAndUpdateMany('users',
 * (user) => user.active === true,
 * (user) => { user.status = 'verified'; return user; }
 * );
 * ```
 */
export declare function findAndUpdateMany(this: GoodDB, key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions): any[] | Promise<any[]>;
/**
 * Remove all values duplicated in a key (array)
 * @param key - The key to remove the duplicated values from
 * @param value - The value to remove
 * @param options - The options to use
 * @returns A promise if the driver is async, otherwise a boolean
 * @example Remove all values duplicated in a key
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 * path: './database.json'
 * }));
 *
 * db.distinct('key', 'value');
 * ```
 *
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 * uri: "..."
 * }));
 *
 * await db.connect();
 *
 * await db.distinct('key', 'value');
 * ```
 */
export declare function distinct(this: GoodDB, key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean | Promise<boolean>;
