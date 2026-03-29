import { GoodDB } from "../good.db";
import { methodOptions } from "../Types";
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
export declare function set(this: GoodDB, key: string, value: any, options?: methodOptions): boolean | Promise<boolean>;
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
export declare function get(this: GoodDB, key: string, options?: methodOptions): any | Promise<any>;
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
export declare function deleteKey(this: GoodDB, key: string, options?: methodOptions): boolean | Promise<boolean>;
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
export declare function setMany(this: GoodDB, data: Record<string, any>, options?: methodOptions): boolean | Promise<boolean>;
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
export declare function getMany(this: GoodDB, keys: string[], options?: methodOptions): Record<string, any> | Promise<Record<string, any>>;
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
export declare function deleteMany(this: GoodDB, keys: string[], options?: methodOptions): boolean | Promise<boolean>;
