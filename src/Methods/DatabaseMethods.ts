import { GoodDB } from "../good.db";
import { methodOptions } from "../Types";
import { DatabaseError } from "../utils/ErrorMessage";
import { deleteValueAtPath, getValueAtPath, setValueAtPath } from "../utils/nested";

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
export function set(this: GoodDB, key: string, value: any, options?: methodOptions): boolean | Promise<boolean> {
    this.checkKey(key);
    options = options || this.getNestedOptions;

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const splitKeys = key.split(options?.nested as string);
                    const firstKey = splitKeys[0];
                    const otherKeys = splitKeys.slice(1).join(options?.nested as string);
                    const cachedData = this.cacheService?.get(firstKey);
                    const data = cachedData ?? await this.driver.getRowByKey(this.tableName, firstKey);

                    const newData = setValueAtPath(data || {}, otherKeys, value, { separator: options?.nested });

                    await this.driver.setRowByKey(this.tableName, firstKey, newData.object);
                    this.cacheService?.put(firstKey, newData.object);
                    resolve(true);
                } else {
                    await this.driver.setRowByKey(this.tableName, key, value);
                    this.cacheService?.put(key, value);
                    resolve(true);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const splitKeys = key.split(options?.nested as string);
        const firstKey = splitKeys[0];
        const otherKeys = splitKeys.slice(1).join(options?.nested as string);
        const cachedData = this.cacheService?.get(firstKey);
        const data = cachedData ?? this.driver.getRowByKey(this.tableName, firstKey);

        const newData = setValueAtPath(data || {}, otherKeys, value, { separator: options?.nested });

        this.driver.setRowByKey(this.tableName, firstKey, newData.object);
        this.cacheService?.put(firstKey, newData.object);
        return true;
    } else {
        this.driver.setRowByKey(this.tableName, key, value);
        this.cacheService?.put(key, value);
        return true;
    }
}

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
export function get(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const [firstKey, ...otherKeys] = key.split(options?.nested as string);
                    const cachedData = this.cacheService?.get(firstKey);
                    const data = cachedData ?? await this.driver.getRowByKey(this.tableName, firstKey);

                    if (typeof data !== 'object' || data === null) {
                        return resolve(undefined);
                    }

                    // Only cache if it wasn't already in cache and we got valid data
                    if (!cachedData && data) {
                        this.cacheService?.put(firstKey, data);
                    }

                    const getData = getValueAtPath(data, otherKeys.join(options?.nested as string), { separator: options?.nested });
                    return resolve(getData.value);
                } else {
                    const cachedData = this.cacheService?.get(key);
                    const data = cachedData ?? await this.driver.getRowByKey(this.tableName, key);

                    // Only cache if it wasn't already in cache and we got valid data
                    if (!cachedData && data !== undefined) {
                        this.cacheService?.put(key, data);
                    }
                    return resolve(data);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const splitKeys = key.split(options?.nested as string);
        const firstKey = splitKeys[0];
        const otherKeys = splitKeys.slice(1).join(options?.nested as string);
        const cachedData = this.cacheService?.get(firstKey);
        const data = cachedData ?? this.driver.getRowByKey(this.tableName, firstKey);

        if (typeof data !== 'object' || data === null) {
            return undefined;
        }

        // Only cache if it wasn't already in cache and we got valid data
        if (!cachedData && data) {
            this.cacheService?.put(firstKey, data);
        }

        const getData = getValueAtPath(data, otherKeys, { separator: options?.nested });
        return getData.value;
    } else {
        const cachedData = this.cacheService?.get(key);
        const data = cachedData ?? this.driver.getRowByKey(this.tableName, key);

        // Only cache if it wasn't already in cache and we got valid data
        if (!cachedData && data !== undefined) {
            this.cacheService?.put(key, data);
        }
        return data;
    }
}

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
export function deleteKey(this: GoodDB, key: string, options?: methodOptions): boolean | Promise<boolean> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const [firstKey, ...otherKeys] = key.split(options?.nested as string);
                    const data = await this.get(firstKey);

                    const deleteData = deleteValueAtPath(data || {}, otherKeys.join(options!.nested), { separator: options?.nested });

                    await this.driver.setRowByKey(this.tableName, firstKey, deleteData.object);
                    this.cacheService?.put(firstKey, deleteData.object);
                    resolve(true);
                } else {
                    await this.driver.deleteRowByKey(this.tableName, key);
                    this.cacheService?.delete(key);
                    resolve(true);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const [firstKey, ...otherKeys] = key.split(options?.nested as string);
        const data = this.get(firstKey);
        const deleteDate = deleteValueAtPath(data || {}, otherKeys.join(options!.nested), { separator: options?.nested });

        this.driver.setRowByKey(this.tableName, firstKey, deleteDate.object);
        this.cacheService?.put(firstKey, deleteDate.object);
        return true;
    } else {
        this.driver.deleteRowByKey(this.tableName, key);
        this.cacheService?.delete(key);
        return true;
    }
}

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
export function setMany(this: GoodDB, data: Record<string, any>, options?: methodOptions): boolean | Promise<boolean> {
    if (!data || typeof data !== 'object') throw new DatabaseError('Data must be a valid object');
    const keys = Object.keys(data);
    if (keys.length === 0) throw new DatabaseError('Data object cannot be empty');

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const key of keys) {
                    await this.set(key, data[key], options);
                }
                resolve(true);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        for (const key of keys) {
            this.set(key, data[key], options);
        }
        return true;
    }
}

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
export function getMany(this: GoodDB, keys: string[], options?: methodOptions): Record<string, any> | Promise<Record<string, any>> {
    if (!Array.isArray(keys)) throw new DatabaseError('Keys must be an array');
    if (keys.length === 0) throw new DatabaseError('Keys array cannot be empty');
    const result: Record<string, any> = {};

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const key of keys) {
                    result[key] = await this.get(key, options);
                }
                resolve(result);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        for (const key of keys) {
            result[key] = this.get(key, options);
        }
        return result;
    }
}

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
export function deleteMany(this: GoodDB, keys: string[], options?: methodOptions): boolean | Promise<boolean> {
    if (!Array.isArray(keys)) throw new DatabaseError('Keys must be an array');
    if (keys.length === 0) throw new DatabaseError('Keys array cannot be empty');

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const key of keys) {
                    await this.delete(key, options);
                }
                resolve(true);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        for (const key of keys) {
            this.delete(key, options);
        }
        return true;
    }
}
