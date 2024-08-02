import { MongoDBDriver } from "./Drivers/Mongo";
import { MySQLDriver } from "./Drivers/MySQL";
import { PostgreSQLDriver } from "./Drivers/PostgreSQL";
import { SQLiteDriver } from "./Drivers/SQLite";
import { AllDataReturns, AllTypes, Drivers, goodDBOptions, IGoodDB, MathSigns, methodOptions } from "./Types";
import { DatabaseError } from "./utils/ErrorMessage";
import { LRUCache } from "./utils/Caching";
import { deleteValueAtPath, getValueAtPath, setValueAtPath } from "./utils/nested";
import { checkDriverIsAsync } from "./utils/Utils";

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
export default class GoodDB implements IGoodDB {
    public readonly driver: Drivers;
    public readonly tableName: string;
    public readonly nested: {
        nested: string;
        isEnabled: boolean;
    };
    public readonly cacheIsEnabled: boolean;
    public readonly isAsync: boolean;
    public cacheService: LRUCache | undefined;

    constructor(
        driver?: Drivers,
        public readonly options?: goodDBOptions
    ) {
        this.driver = driver || new SQLiteDriver({
            path: './database.sqlite'
        });
        this.nested = {
            nested: options?.nested || '..',
            isEnabled: options?.nestedIsEnabled ? true : false,
        };
        this.tableName = options?.table || 'gooddb';
        this.isAsync = checkDriverIsAsync(this.driver);

        if (!this.isAsync) {
            this.driver.init(this.tableName);
        };
        this.cacheIsEnabled = options?.cache?.isEnabled ?? false;
        this.cacheService = this.cacheIsEnabled ? new LRUCache(
            options?.cache?.capacity ?? 1024
        ) : undefined;
    };

    private get getNestedOptions(): {
        nested: string;
        nestedIsEnabled: boolean;
    } {
        return {
            nested: this.nested.nested ?? '..',
            nestedIsEnabled: this.nested.isEnabled ?? false,
        };
    };

    private checkKey(key: string): void {
        if (!key || typeof key !== 'string' || !key?.trim()) throw new DatabaseError(`GoodDB requires keys to be a string. Provided: ${key?.trim() ? typeof key : 'Null'}`);
    };

    // Date methods //

    // End date methods //

    // Database methods //

    /**
     * Set a value to a key
     * @param key - The key to set the value to
     * @param value - The value to set
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Set a value to a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.set('key', 'value');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.set('key', 'value');
     * ```
     */
    public async set(key: string, value: any, options?: methodOptions): Promise<boolean>;
    public set(key: string, value: any, options?: methodOptions): boolean;
    public set(key: string, value: any, options?: methodOptions): boolean | Promise<boolean> {
        this.checkKey(key);
        options = options || this.getNestedOptions;
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        // Split all keys
                        const splitKeys = key.split(options?.nested as string);
                        // First key
                        const firstKey = splitKeys[0];
                        // Other keys
                        const otherKeys = splitKeys.slice(1).join(options?.nested as string);
                        // Get the data
                        const data = this.cacheService?.get(firstKey) ?? await this.get(firstKey);

                        const newData = setValueAtPath(data || {}, otherKeys, value, {
                            separator: options?.nested,
                        });

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
            // Split all keys
            const splitKeys = key.split(options?.nested as string);
            // First key
            const firstKey = splitKeys[0];
            // Other keys
            const otherKeys = splitKeys.slice(1).join(options?.nested as string);
            // Get the data
            const data = this.cacheService?.get(firstKey) ?? this.get(firstKey);

            const newData = setValueAtPath(data || {}, otherKeys, value, {
                separator: options?.nested,
            });

            this.driver.setRowByKey(this.tableName, firstKey, newData.object);
            this.cacheService?.put(firstKey, newData.object);

            return true;
        } else {
            this.driver.setRowByKey(this.tableName, key, value);
            this.cacheService?.put(key, value);
            return true;
        }
    };

    /**
     * Get a value from a key
     * @param key - The key to get the value from
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a value
     * @example Get a value from a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.get('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.get('key');
     * ```
     */
    public async get(key: string, options?: methodOptions): Promise<any>;
    public get(key: string, options?: methodOptions): any;
    public get(key: string, options?: methodOptions): any | Promise<any> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        // Split all keys
                        let [firstKey, ...otherKeys] = key.split(options?.nested as string);
                        // Get the data
                        const data = this.cacheService?.get(firstKey) ?? await this.driver.getRowByKey(this.tableName, firstKey);

                        if (typeof data !== 'object' || !data) {
                            return resolve(undefined);
                        };

                        // Get the value
                        const getData = getValueAtPath(data || {}, otherKeys.join(options?.nested as string), {
                            separator: options?.nested,
                        });

                        this.cacheService?.put(firstKey, getData.object);
                        return resolve(getData.value);
                    } else {
                        const data = this.cacheService?.get(key) ?? await this.driver.getRowByKey(this.tableName, key);
                        this.cacheService?.put(key, data);
                        return resolve(data);
                    }
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
            // Split all keys
            const splitKeys = key.split(options?.nested as string);
            // First key
            const firstKey = splitKeys[0];
            // Other keys
            const otherKeys = splitKeys.slice(1).join(options?.nested as string);
            // Get the data
            const data = this.cacheService?.get(firstKey) ?? this.driver.getRowByKey(this.tableName, firstKey);
            if (typeof data !== 'object' || !data) {
                return undefined;
            };
            // Get the value
            const getData = getValueAtPath(data || {}, otherKeys, {
                separator: options?.nested,
            });

            this.cacheService?.put(firstKey, getData.object);
            return getData.value;
        } else {
            const data = this.cacheService?.get(key) ?? this.driver.getRowByKey(this.tableName, key);
            this.cacheService?.put(key, data);
            return data;
        }
    };


    /**
     * Delete a key
     * @param key - The key to delete
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Delete a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.delete('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     * await db.connect();
     * await db.delete('key');
     * ```
     */
    public async delete(key: string, options: methodOptions): Promise<boolean>;
    public delete(key: string, options?: methodOptions): boolean;
    public delete(key: string, options?: methodOptions): boolean | Promise<boolean> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        // Split all keys
                        const [firstKey, ...otherKeys] = key.split(options?.nested as string);
                        // Get the data
                        const data = await this.get(firstKey);

                        const deleteData = deleteValueAtPath(data || {}, otherKeys.join(options.nested), {
                            separator: options?.nested,
                        });

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
            const deleteDate = deleteValueAtPath(data || {}, otherKeys.join(options.nested), {
                separator: options?.nested,
            });

            this.driver.setRowByKey(this.tableName, firstKey, deleteDate.object);
            this.cacheService?.put(firstKey, deleteDate.object);
            return true;
        } else {
            this.driver.deleteRowByKey(this.tableName, key);
            this.cacheService?.delete(key);
            return true;
        }
    };


    // End database methods //

    // Array methods //

    /**
     * Push a value to a key
     * @param key - The key to push the value to
     * @param value - The value to push
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a number
     * @example Push a value to a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.push('key', 'value');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.push('key', 'value');
     * ```
     */
    public async push(key: string, value: any, options?: methodOptions): Promise<number>;
    public push(key: string, value: any, options?: methodOptions): number;
    public push(key: string, value: any, options?: methodOptions): number | Promise<number> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.push(value);
                    await this.set(key, data, options);
                    resolve(data.length);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
            }
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
            data.push(value);
            this.set(key, data, options);
            return data.length;
        }
    };

    /**
     * Shift a value from a key
     * @param key - The key to shift the value from
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a value
     * @example Shift a value from a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({
     *        path: './database.json'
     * }));
     * db.shift('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *   uri: "..."
     * }));
     * await db.connect();
     * await db.shift('key');
     * ```
     */
    public async shift(key: string, options?: methodOptions): Promise<any>;
    public shift(key: string, options?: methodOptions): any;
    public shift(key: string, options?: methodOptions): any | Promise<any> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        resolve(undefined);
                    }
                    const value = data.shift();
                    await this.set(key, data, options);
                    resolve(value);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                return undefined;
            }
            const value = data.shift();
            this.set(key, data, options);
            return value;
        }
    };

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
     *       path: './database.json'
     * }));
     * db.unshift('key', 'value');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *  uri: "..."
     * }));
     * await db.connect();
     * await db.unshift('key', 'value');
     * ```
     */
    public async unshift(key: string, value: any, options?: methodOptions): Promise<number>;
    public unshift(key: string, value: any, options?: methodOptions): number;
    public unshift(key: string, value: any, options?: methodOptions): number | Promise<number> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.unshift(value);
                    await this.set(key, data, options);
                    resolve(data.length);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
            }
            data.unshift(value);
            this.set(key, data, options);
            return data.length;
        }
    };

    /**
     * Pop a value from a key
     * @param key - The key to pop the value from
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a value
     * @example Pop a value from a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *      path: './database.json'
     * }));
     * db.pop('key');
     * ```
     * 
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * await db.connect();
     * await db.pop('key');
     * ```
     */
    public async pop(key: string, options?: methodOptions): Promise<any>;
    public pop(key: string, options?: methodOptions): any;
    public pop(key: string, options?: methodOptions): any | Promise<any> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        resolve(undefined);
                    }
                    const value = data.pop();
                    await this.set(key, data, options);
                    resolve(value);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                return undefined;
            }
            const value = data.pop();
            this.set(key, data, options);
            return value;
        }
    };

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
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.pull('key', 'value');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.pull('key', 'value');
     * ```
     */
    public async pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    public pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean;
    public pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): Promise<boolean> | boolean {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (!key) {
            throw new DatabaseError("The key is not defined!");
        }
        const pullFromArray = (array: any[], data: any): boolean => {
            const indexesToRemove: number[] = [];

            let removed = false;
            array.forEach((element: any, index: number) => {
                if ((typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) || element === valueOrCallback) {
                    indexesToRemove.push(index);
                    if (!pullAll && !removed) {
                        removed = true;
                    }
                };
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

        const pullFromNestedObject = (currentObject: any, keyParts: string[], depth: number, data: any): boolean => {
            const part = keyParts[depth];

            if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                throw new DatabaseError(`Cannot pull from a non-object or non-array value at key '${part}'`);
            }


            if (depth === keyParts.slice(1).length) {
                return pullFromArray(currentObject[part], data);
            } else {
                const updated = pullFromNestedObject(currentObject[part], keyParts, depth + 1, data);
                if (updated) {
                    this.set(key, data, options);
                }
                return updated;
            }
        };

        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data: any = await this.get(key, options);
                    if (!data) {
                        resolve(false);
                    };

                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        // const keyParts = key.split(options.nested as string);
                        resolve(pullFromArray(data, data));
                    } else {
                        if (!Array.isArray(data)) {
                            throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        resolve(pullFromArray(data, data));
                    }
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data: any = this.get(key, options);
            if (!data) {
                return false;
            };

            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                // const keyParts = key.split(options.nested as string);
                return pullFromArray(data, data);
            } else {
                if (!Array.isArray(data)) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }
                return pullFromArray(data, data);
            }
        };
    };

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
     *     path: './database.json'
     * }));
     * 
     * db.find('key', (value) => value === 'value');
     * ```
     * 
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * 
     * await db.connect();
     * 
     * await db.find('key', (value) => value === 'value');
     * ```
     */
    public async find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): Promise<any>;
    public find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any;
    public find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): Promise<any> | any {
        options = options || this.getNestedOptions;
        if (typeof callback !== 'function') throw new DatabaseError(`GoodDB requires the callback to be a function. Provided: ${typeof callback}`);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data)) {
                        throw new DatabaseError('Value is not an array');
                    }
                    resolve(data.find(callback));
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data)) {
                throw new DatabaseError('Value is not an array');
            }
            return data.find(callback);
        }
    };

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
     *    path: './database.json'
     * }));
     * 
     * db.distinct('key', 'value');
     * ```
     * 
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *   uri: "..."
     * }));
     * 
     * await db.connect();
     * 
     * await db.distinct('key', 'value');
     * ```
     */
    public async distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): Promise<boolean>;
    public distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean;
    public distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): Promise<boolean> | boolean {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data)) {
                        throw new DatabaseError('Value is not an array');
                    }
                    let newData;
                    if (value !== undefined) {
                        if (typeof value === 'function') {
                            newData = data.filter(value);
                        } else {
                            newData = data.filter((v, i, a) => a.indexOf(v) === i);
                        };
                    } else {
                        newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
                        newData = newData.map(item => JSON.parse(item));
                    };
                    await this.set(key, newData, options);
                    resolve(true);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data)) {
                throw new DatabaseError('Value is not an array');
            }
            let newData;
            if (value !== undefined) {
                if (typeof value === 'function') {
                    newData = data.filter(value);
                } else {
                    newData = data.filter((v, i, a) => a.indexOf(v) === i);
                };
            } else {
                newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
                newData = newData.map(item => JSON.parse(item));
            };
            this.set(key, newData, options);
            return true;
        }
    };

    // /**
    //  * Filter a key in a collection
    //  * @param key - The key to filter in the collection
    //  * @param callback - The callback filter function to use
    //  * @param options - The options to use
    //  * @example Find a filter in a collection
    //  * ## Using the JSONDriver (sync)
    //  * ```javascript
    //  * const db = new GoodDB(new JSONDriver({
    //  *     path: './database.json'
    //  * }));
    //  * 
    //  * db.filter('key', (value) => value === 'value')
    //  * ```
    //  * 
    //  * ## Using the MongoDBDriver (async)
    //  * ```javascript
    //  * const db = new GoodDB(new MongoDBDriver({
    //  *    uri: "..."
    //  * }));
    //  * 
    //  * await db.connect();
    //  * 
    //  * await db.filter('key', (value) => value === 'value');
    //  * ```
    //  */
    // public async filter()

    // End array methods //

    // Math methods //

    /**
     * Add a value to a key
     * @param key - The key to add the value to
     * @param value - The value to add
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a number
     * @example Add a value to a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.add('key', 1);
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     * await db.connect();
     * await db.add('key', 1);
     * ```
     */
    public async add(key: string, value: number, options?: methodOptions): Promise<number>;
    public add(key: string, value: number, options?: methodOptions): number;
    public add(key: string, value: number, options?: methodOptions): Promise<number> | number {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) + value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) + value;
            this.set(key, newValue, options);
            return newValue;
        }
    };

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
     *      path: './database.json'
     * }));
     * db.multiply('key', 2);
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.multiply('key', 2);
     * ```
     */
    public async multiply(key: string, value: number, options?: methodOptions): Promise<number>;
    public multiply(key: string, value: number, options?: methodOptions): number;
    public multiply(key: string, value: number, options?: methodOptions): Promise<number> | number {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 1) * value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 1) * value;
            this.set(key, newValue, options);
            return newValue;
        }
    };

    /**
     * Double a value to a key
     * @param key - The key to double the value to
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a number
     * @example Double a value to a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *     path: './database.json'
     * }));
     * db.double('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * await db.connect();
     * await db.double('key');
     * ```
     */
    public async double(key: string, options?: methodOptions): Promise<number>;
    public double(key: string, options?: methodOptions): number;
    public double(key: string, options?: methodOptions): Promise<number> | number {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 1) * 2;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 1) * 2;
            this.set(key, newValue, options);
            return newValue;
        }
    };

    /**
     * Subtract a value from a key
     * @param key - The key to subtract the value from
     * @param value - The value to subtract
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a number
     * @example Subtract a value from a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.subtract('key', 1);
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     * await db.connect();
     * await db.subtract('key', 1);
     * ```
     */
    public async subtract(key: string, value: number, options?: methodOptions): Promise<number>;
    public subtract(key: string, value: number, options?: methodOptions): number;
    public subtract(key: string, value: number, options?: methodOptions): Promise<number> | number {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) - value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) - value;
            this.set(key, newValue, options);
            return newValue;
        }
    };

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
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.math('key', '+', 1);
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.math('key', '+', 1);
     * ```
     */
    public async math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): Promise<number>;
    public math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): number;
    public math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): number | Promise<number> {
        options = options || this.getNestedOptions;
        this.checkKey(key);
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    let data: any = await this.get(key, options);

                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
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
                                throw new DatabaseError('Cannot divide by zero');
                            }
                            data = (data || 0) / value;
                            break;
                        default:
                            throw new DatabaseError('Invalid math sign');
                    }

                    this.set(key, data, options)
                        .then(() => resolve(data))
                        .catch((error: any) => reject(new Error(error)));
                } catch (error: any) {
                    reject(new Error(error));
                }
            });
        } else {
            try {
                let data: any = this.get(key, options);

                if (typeof data !== 'number' && data !== undefined) {
                    throw new DatabaseError('Value is not a number');
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
                            throw new DatabaseError('Cannot divide by zero');
                        }
                        data = (data || 0) / value;
                        break;
                    default:
                        throw new DatabaseError('Invalid math sign');
                }

                this.set(key, data, options);
                return data;
            } catch (error: any) {
                throw new Error(error);
            }
        }
    };

    // End math methods //

    // Other methods //

    /**
     * Get the type of a key
     * @param key - The key to get the type of
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a string
     * @example Get the type of a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.type('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *      uri: "..."
     * }));
     * await db.connect();
     * await db.type('key');
     * ```
     */
    public async type(key: string, options?: methodOptions): Promise<string>;
    public type(key: string, options?: methodOptions): string;
    public type(key: string, options?: methodOptions): Promise<string> | string {
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
    };

    /**
     * Get the size of a key
     * @param key - The key to get the size of
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a number
     * @example Get the size of a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.size('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.size('key');
     * ```
     */
    public async size(key: string, options?: methodOptions): Promise<number>;
    public size(key: string, options?: methodOptions): number;
    public size(key: string, options?: methodOptions): Promise<number> | number {
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
    };

    /**
    * Check if a key exists
    * @param key - The key to check if it exists
    * @param options - The options to use
    * @returns A promise if the driver is async, otherwise a boolean
    * @example Check if a key exists
    * ## Using the JSONDriver (sync)
    * ```javascript
    *   const db = new GoodDB(new JSONDriver({ 
    *         path: './database.json' 
    *   }));
    *   db.has('key');
    * ```
    * ## Using the MongoDBDriver (async)
    * ```javascript
    *  const db = new GoodDB(new MongoDBDriver({
    *         uri: "..."
    *  }));
    *  await db.connect();
    *  await db.has('key');
    * ```
    */
    public async has(key: string, options?: methodOptions): Promise<boolean>;
    public has(key: string, options?: methodOptions): boolean;
    public has(key: string, options?: methodOptions): Promise<boolean> | boolean {
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
    };

    // End Other methods //

    // Collection methods //


    /**
    * Get all the values that start with a key
    * @param key - The key to check if it starts with the value
    * @param options - The options to use
    * @returns A promise if the driver is async, otherwise a value
    * @example Get all the values that start with a key
    * ## Using the JSONDriver (sync)
    * ```javascript
    *   const db = new GoodDB(new JSONDriver({ 
    *         path: './database.json' 
    *   }));
    *   db.startsWith('key');
    * ```
    * ## Using the MongoDBDriver (async)
    * ```javascript
    *  const db = new GoodDB(new MongoDBDriver({
    *         uri: "..."
    *  }));
    *  await db.connect();
    *  await db.startsWith('key');
    * ```
    */
    public async startsWith(key: string, options?: methodOptions): Promise<any>;
    public startsWith(key: string, options?: methodOptions): any;
    public startsWith(key: string, options?: methodOptions): Promise<any> | any {
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
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.startsWith(lastKey)) {
                                result[k] = data[k];
                            }
                        };
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
            };
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
    };

    /**
     * Get all the values that end with a key
     * @param key - The key to check if it ends with the value
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a value
     * @example Get all the values that end with a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     *   const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *   db.endsWith('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     *  await db.connect();
     *  await db.endsWith('key');
     * ```
     */
    public async endsWith(key: string, options?: methodOptions): Promise<any>;
    public endsWith(key: string, options?: methodOptions): any;
    public endsWith(key: string, options?: methodOptions): Promise<any> | any {
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
                        };
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
            };
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
    };

    /**
     * Get the values that include a key
     * @param key - The key to check if it includes the value
     * @param options - The options to use
     * @returns A promise if the driver is async, otherwise a value
     * @example Get the values that include a key
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *        path: './database.json'
     * }));
     * db.includes('key');
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * await db.connect();
     * await db.includes('key');
     * ```
     */
    public async includes(key: string, options?: methodOptions): Promise<any>;
    public includes(key: string, options?: methodOptions): any;
    public includes(key: string, options?: methodOptions): Promise<any> | any {
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
                        };
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
            };
            const keys: string[] = Object.keys(data);

            const result: any = {};
            for (const k of keys) {
                if (k.includes(lastKey)) {
                    result[k] = data[k];
                }
            };
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
    };

    /**
     * Get all the keys
     * @returns A promise if the driver is async, otherwise an array
     * @example Get all the keys
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.keys();
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.keys();
     * ```
     */
    public async keys(): Promise<string[]>;
    public keys(): string[];
    public keys(): Promise<string[]> | string[] {
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
    };

    /**
     * Get all the values
     * @returns A promise if the driver is async, otherwise an array
     * @example Get all the values
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     * db.values();
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.values();
     * ```
     */
    public async values(): Promise<any[]>;
    public values(): any[];
    public values(): Promise<any[]> | any[] {
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
    };

    /**
     * Get all the keys and values
     * @returns A promise if the driver is async, otherwise an object
     * @example Get all the keys and values
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *  db.all();
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     * await db.connect();
     * await db.all();
     * ```
     */
    public async all(type?: 'object' | 'array' | undefined): Promise<AllDataReturns>;
    public all(type?: 'object' | 'array' | undefined): AllDataReturns;
    public all(type: 'object' | 'array' | undefined = 'object'): AllDataReturns | Promise<AllDataReturns> {
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
                        };

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
                        };
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
                    };
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
                };
                return data
                    .map(({ key, value }: { key: string, value: any }) => {
                        if (!key) return;
                        return { key: key, value: typeof value !== 'string' ? value : JSON.parse(value) };
                    })
                    .filter(Boolean);
            } else {
                if (isObject) {
                    return data;
                };
                return Object.fromEntries(
                    data
                        .map(({ key, value }: { key: string, value: any }) => {
                            if (!key) return;
                            return [key, typeof value !== 'string' ? value : JSON.parse(value)];
                        })
                        .filter(Boolean)
                );
            };
        }
    };

    /**
     * Clear the database
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Clear the database
     * ## Using the JSONDriver (sync)
     * ```javascript
     *  const db = new GoodDB(new JSONDriver({ 
     *         path: './database.json' 
     *   }));
     *  db.clear();
     * ```
     * ## Using the MongoDBDriver (async)
     * ```javascript
     *  const db = new GoodDB(new MongoDBDriver({
     *         uri: "..."
     *  }));
     * await db.connect();
     * await db.clear();
     * ```
     */
    public async clear(): Promise<boolean>;
    public clear(): boolean;
    public clear(): boolean | Promise<boolean> {
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
    };

    /**
     * Make table for the database
     * @param name - The name of the tableName
     * @returns A promise if the driver is async, otherwise a boolean
     * @example Make tableName for the database
     * ## Using the MongoDBDriver (async)
     * ```javascript
     * const db = new GoodDB(new MongoDBDriver({
     *    uri: "..."
     * }));
     * await db.connect();
     * await db.table('tableName');
     * ```
     * ## Using the JSONDriver (sync)
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *   path: './database.json'
     * }));
     * await db.table('tableName');
     * ```
     */
    public async table(name: string): Promise<GoodDB>;
    public table(name: string): GoodDB;
    public table(name: string): GoodDB | Promise<GoodDB> {
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
    };

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
    public async connect(): Promise<boolean> {
        if (checkDriverIsAsync(this.driver)) {
            return await this.driver.init(this.tableName) as boolean;
        } else {
            throw new DatabaseError('This driver does not support the connect method');
        }
    };

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
    public async disconnect(): Promise<boolean> {
        if (checkDriverIsAsync(this.driver)) {
            return (this.driver as MongoDBDriver | MySQLDriver | PostgreSQLDriver)
                .close();
        } else {
            throw new DatabaseError('This driver does not support the disconnect method');
        }
    };

    // End Async methods //
};