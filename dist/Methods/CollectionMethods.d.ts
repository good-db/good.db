import { GoodDB } from "../good.db";
import { methodOptions } from "../Types";
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
export declare function startsWith(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
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
export declare function endsWith(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
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
export declare function includes(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
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
export declare function keys(this: GoodDB): string[] | Promise<string[]>;
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
export declare function values(this: GoodDB): any[] | Promise<any[]>;
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
export declare function all(this: GoodDB, type?: 'object' | 'array' | undefined): any | Promise<any>;
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
export declare function clear(this: GoodDB): boolean | Promise<boolean>;
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
export declare function type(this: GoodDB, key: string, options?: methodOptions): string | Promise<string>;
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
export declare function size(this: GoodDB, key: string, options?: methodOptions): number | Promise<number>;
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
export declare function has(this: GoodDB, key: string, options?: methodOptions): boolean | Promise<boolean>;
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
export declare function table(this: GoodDB, name: string): GoodDB | Promise<GoodDB>;
