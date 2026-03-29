import { GoodDB } from "../good.db";
import { methodOptions } from "../Types";
import { DatabaseError } from "../utils/ErrorMessage";

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
export function startsWith(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                    const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
                    const data: any = this.get(k, options);

                    if (typeof data !== 'object') {
                        throw new DatabaseError('Value is not an object');
                    }
                    const keys: string[] = Object.keys(data);

                    const result: any = {};
                    for (const k of keys) {
                        if (k.startsWith(lastKey)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                } else {
                    const data = await this.all();
                    const keys = Object.keys(data);
                    const result: any = {};
                    for (const k of keys) {
                        if (k.startsWith(key)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
        const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
        const data: any = this.get(k, options);

        if (typeof data !== 'object') {
            throw new DatabaseError('Value is not an object');
        }
        const keys: string[] = Object.keys(data);

        const result: any = {};
        for (const k of keys) {
            if (k.startsWith(lastKey)) {
                result[k] = data[k];
            }
        }
        return result;
    } else {
        const data = this.all() as any;
        const keys = Object.keys(data);
        const result: any = {};
        for (const k of keys) {
            if (k.startsWith(key)) {
                result[k] = data[k];
            }
        }
        return result;
    }
}

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
export function endsWith(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                    const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
                    const data: any = await this.get(k, options);
                    if (typeof data !== 'object') {
                        throw new DatabaseError('Value is not an object');
                    }
                    const keys: string[] = Object.keys(data);

                    const result: any = {};
                    for (const k of keys) {
                        if (k.endsWith(lastKey)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                } else {
                    const data = await this.all();
                    const keys = Object.keys(data);
                    const result: any = {};
                    for (const k of keys) {
                        if (k.endsWith(key)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
        const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
        const data: any = this.get(k, options);
        if (typeof data !== 'object') {
            throw new DatabaseError('Value is not an object');
        }
        const keys: string[] = Object.keys(data);

        const result: any = {};
        for (const k of keys) {
            if (k.endsWith(lastKey)) {
                result[k] = data[k];
            }
        }
        return result;
    } else {
        const data = this.all() as any;
        const keys = Object.keys(data);
        const result: any = {};
        for (const k of keys) {
            if (k.endsWith(key)) {
                result[k] = data[k];
            }
        }
        return result;
    }
}

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
export function includes(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                    const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                    const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
                    const data: any = await this.get(k, options);
                    if (typeof data !== 'object') {
                        throw new DatabaseError('Value is not an object');
                    }
                    const keys: string[] = Object.keys(data);

                    const result: any = {};
                    for (const k of keys) {
                        if (k.includes(lastKey)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                } else {
                    const data = await this.all();
                    const keys = Object.keys(data);
                    const result: any = {};
                    for (const k of keys) {
                        if (k.includes(key)) {
                            result[k] = data[k];
                        }
                    }
                    resolve(result);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
        const lastKey = key.split(options?.nested as string).slice(-1).join(options?.nested as string);
        const data: any = this.get(k, options);

        if (typeof data !== 'object') {
            throw new DatabaseError('Value is not an object');
        }
        const keys: string[] = Object.keys(data);

        const result: any = {};
        for (const k of keys) {
            if (k.includes(lastKey)) {
                result[k] = data[k];
            }
        }
        return result;
    } else {
        const data = this.all() as any;
        const keys = Object.keys(data);
        const result: any = {};
        for (const k of keys) {
            if (k.includes(key)) {
                result[k] = data[k];
            }
        }
        return result;
    }
}

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
export function keys(this: GoodDB): string[] | Promise<string[]> {
    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.all();
                resolve(Object.keys(data));
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.all();
        return Object.keys(data);
    }
}

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
export function values(this: GoodDB): any[] | Promise<any[]> {
    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.all();
                resolve(Object.values(data));
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.all();
        return Object.values(data);
    }
}

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
export function all(this: GoodDB, type: 'object' | 'array' | undefined = 'object'): any | Promise<any> {
    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const [data, isObject] = await this.driver.getAllRows(this.tableName);
                if (type === 'array') {
                    if (isObject) {
                        return resolve(
                            Object.entries(data)
                                .map(([key, value]) => {
                                    if (!key) return;
                                    return { key, value };
                                })
                                .filter(Boolean)
                        );
                    }

                    return resolve(
                        data
                            .map(({ key, value }: { key: string, value: any }) => {
                                if (!key) return;
                                return { key: key, value: typeof value !== 'string' ? value : JSON.parse(value) };
                            })
                            .filter(Boolean)
                    );
                } else {
                    if (isObject) {
                        return resolve(data);
                    }
                    return resolve(
                        Object.fromEntries(
                            data
                                .map(({ key, value }: { key: string, value: any }) => {
                                    if (!key) return;
                                    return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                                })
                                .filter(Boolean)
                        )
                    );
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const [data, isObject] = this.driver.getAllRows(this.tableName);

        if (type === 'array') {
            if (isObject) {
                return Object.entries(data)
                    .map(([key, value]) => {
                        if (!key) return;
                        return { key, value };
                    })
                    .filter(Boolean);
            }
            return data
                .map(({ key, value }: { key: string, value: any }) => {
                    if (!key) return;
                    return { key: key, value: typeof value !== 'string' ? value : JSON.parse(value) };
                })
                .filter(Boolean);
        } else {
            if (isObject) {
                return data;
            }
            return Object.fromEntries(
                data
                    .map(({ key, value }: { key: string, value: any }) => {
                        if (!key) return;
                        return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                    })
                    .filter(Boolean)
            );
        }
    }
}

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
export function clear(this: GoodDB): boolean | Promise<boolean> {
    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.driver.deleteAllRows(this.tableName);
                resolve(true);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        this.driver.deleteAllRows(this.tableName);
        return true;
    }
}

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
export function type(this: GoodDB, key: string, options?: methodOptions): string | Promise<string> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.get(key, options);
                if (data === null || data === undefined) {
                    resolve('null');
                } else if (typeof data === 'string') {
                    resolve('string');
                } else if (typeof data === 'number') {
                    resolve('number');
                } else if (typeof data === 'boolean') {
                    resolve('boolean');
                } else if (Array.isArray(data)) {
                    resolve('array');
                } else if (typeof data === 'object') {
                    resolve('object');
                } else {
                    resolve('unknown');
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.get(key, options);
        if (data === null || data === undefined) {
            return 'null';
        } else if (typeof data === 'string') {
            return 'string';
        } else if (typeof data === 'number') {
            return 'number';
        } else if (typeof data === 'boolean') {
            return 'boolean';
        } else if (Array.isArray(data)) {
            return 'array';
        } else if (typeof data === 'object') {
            return 'object';
        } else {
            return 'unknown';
        }
    }
}

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
export function size(this: GoodDB, key: string, options?: methodOptions): number | Promise<number> {
    options = options || this.getNestedOptions;
    this.checkKey(key);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.get(key, options);
                if (data === null || data === undefined) {
                    resolve(0);
                } else if (typeof data === 'string') {
                    resolve(data.length);
                } else if (Array.isArray(data)) {
                    resolve(data.length);
                } else if (typeof data === 'object') {
                    resolve(Object.keys(data).length);
                } else {
                    resolve(0);
                }
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data: any = this.get(key, options);
        if (data === null || data === undefined) {
            return 0;
        } else if (typeof data === 'string') {
            return data.length;
        } else if (Array.isArray(data)) {
            return data.length;
        } else if (typeof data === 'object') {
            return Object.keys(data).length;
        } else {
            return 0;
        }
    }
}

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
export function has(this: GoodDB, key: string, options?: methodOptions): boolean | Promise<boolean> {
    options = options || this.getNestedOptions;

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const value = await this.get(key, options);
                resolve(value !== null && value !== undefined);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        return this.get(key, options) as any ? true : false;
    }
}

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
export function table(this: GoodDB, name: string): GoodDB | Promise<GoodDB> {
    if (!name) throw new DatabaseError('Table name is required.');

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.driver.createTable(name);
                resolve(new GoodDB(this.driver, {
                    ...this.options,
                    table: name,
                }));
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        this.driver.createTable(name);
        return new GoodDB(this.driver, {
            ...this.options,
            table: name,
        });
    }
}
