import { CacheDriver } from "./Drivers/Cache";
import { JSONDriver } from "./Drivers/JSON";
import { MongoDBDriver } from "./Drivers/Mongo";
import { MySQLDriver } from "./Drivers/MySQL";
import { PostgreSQLDriver } from "./Drivers/PostgreSQL";
import { SQLiteDriver } from "./Drivers/SQLite";
import { YMLDriver } from "./Drivers/YML";
import { goodDBOptions, methodOptions } from "./Types";
import { DatabaseError } from "./utils/ErrorMessage";
import { deleteValueAtPath, getValueAtPath, setValueAtPath } from "./utils/nested";

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
export default class GoodDB {
<<<<<<< Updated upstream
    private driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver;
=======
    private driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver | PostgreSQLDriver | MySQLDriver;
    public readonly tableName: string;
>>>>>>> Stashed changes
    public readonly nested: {
        nested: string;
        isEnabled: boolean;
    };
    private isAsync: boolean;

    constructor(
<<<<<<< Updated upstream
        driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver,
=======
        driver?: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver | PostgreSQLDriver | MySQLDriver,
>>>>>>> Stashed changes
        private options?: goodDBOptions
    ) {
        this.driver = driver;
        this.nested = {
            nested: options?.nested || '..',
            isEnabled: options?.nestedIsEnabled ? true : false,
        };
<<<<<<< Updated upstream
        this.isAsync = this.driver instanceof MongoDBDriver ? true : false;
=======
        this.tableName = options?.table || 'gooddb';
        this.isAsync = this.driver instanceof MongoDBDriver || this.driver instanceof PostgreSQLDriver || this.driver instanceof MySQLDriver ? true : false;
>>>>>>> Stashed changes
        if (!this.isAsync) {
            this.driver.init();
        };
    };

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
    public set(key: string, value: any, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const newData = setValueAtPath(await this.driver.read(), key, value, {
                            separator: options?.nested,
                        });

                        await this.driver.write(newData);

                        resolve(true);
                    } else {
                        const data = await this.driver.read();
                        data[key] = value;
                        await this.driver.write(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nested) {
                const newData = setValueAtPath(this.driver.read(), key, value, {
                    separator: this.nested.nested,
                });

                this.driver.write(newData);

                return true;
            } else {
                const data = this.driver.read();
                data[key] = value;
                this.driver.write(data);
                return true;
            }
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
    public get(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const data = getValueAtPath(await this.driver.read(), key, {
                            separator: this.nested.nested,
                        });
                        return resolve(data);
                    } else {
                        const data = await this.driver.read();
                        return resolve(data[key]);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                return getValueAtPath(this.driver.read(), key, {
                    separator: this.nested.nested,
                });
            } else {
                return this.driver.read()[key];
            }
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
    public delete(key: string, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const data = deleteValueAtPath(this.driver.read(), key, {
                            separator: options?.nested,
                        });

                        await this.driver.write(data);

                        resolve(true);
                    } else {
                        const data = await this.driver.read();
                        delete data[key];
                        await this.driver.write(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const data = deleteValueAtPath(this.driver.read(), key, {
                    separator: options?.nested,
                });

                this.driver.write(data);

                return true;
            } else {
                const data = this.driver.read();
                delete data[key];
                this.driver.write(data);
                return true;
            }
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
    public push(key: string, value: any, options?: methodOptions): Promise<number> | number {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.get(key, options);
<<<<<<< Updated upstream
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
=======
>>>>>>> Stashed changes
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
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
    public shift(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
    public unshift(key: string, value: any, options?: methodOptions): Promise<number> | number {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
<<<<<<< Updated upstream
=======
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
    public pop(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
>>>>>>> Stashed changes
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
    public async pull(key: string, valueOrCallback: (e: any, i: number, a: any) => any | number | string | boolean | number | undefined | null, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    public pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): boolean;
    public pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (!key) {
            throw new DatabaseError("The key is not defined!");
        }
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data: any = await this.get(key);
                    console.log(data, 'aadada');

                    if (!data) {
                        resolve(false);
                    }


                    const pullFromArray = async (array: any[]): Promise<boolean> => {
                        const indexesToRemove: number[] = [];

                        let removed = false;
                        array.forEach((element: any, index: number) => {
                            if (!removed && !pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                } else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                }
                            } else if (pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                } else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                }
                            }
                        });

                        if (indexesToRemove.length > 0) {
                            for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                                array.splice(indexesToRemove[i], 1);
                            }
                            await this.set(key, data, options);
                            return true;
                        } else {
                            return false;
                        }
                    };

                    const pullFromNestedObject = async (currentObject: any, keyParts: string[], depth: number): Promise<boolean> => {
                        const part = keyParts[depth];

                        if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                            throw new DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                        }

                        if (depth === keyParts.slice(1).length) {
                            return await pullFromArray(currentObject[part]);
                        } else {
                            const updated = await pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                            if (updated) {
                                await this.set(key, data, options);
                            }
                            return updated;
                        }
                    }

                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const keyParts = key.split(options.nested as string);
                        await pullFromNestedObject(data, keyParts, 0);
                        resolve(true);
                    } else {
                        if (!Array.isArray(data)) {
                            throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        await pullFromArray(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data: any = this.get(key);
            if (!data) {
                return false;
            }

            const pullFromArray = (array: any[]): boolean => {
                const indexesToRemove: number[] = [];

                let removed = false;
                array.forEach((element: any, index: number) => {
                    if (!removed && !pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                            removed = true;
                        } else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                            removed = true;
                        }
                    } else if (pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                        } else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                        }
                    }
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


            const pullFromNestedObject = (currentObject: any, keyParts: string[], depth: number): boolean => {
                const part = keyParts[depth];

                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                }

                if (depth === keyParts.slice(1).length) {
                    return pullFromArray(currentObject[part]);
                } else {
                    const updated = pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                    if (updated) {
                        this.set(key, data, options);
                    }
                    return updated;
                }
            };

            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const keyParts = key.split(options.nested as string);
                return pullFromNestedObject(data, keyParts, 0);
            } else {
                if (!Array.isArray(data)) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }
                return pullFromArray(data);
            }
        }
    };

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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
    public async math(key: string, mathSign: string, value: number, options?: methodOptions): Promise<number>;
    public math(key: string, mathSign: string, value: number, options?: methodOptions): number;
    public math(key: string, mathSign: string, value: number, options?: methodOptions): number | Promise<number> {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };

        if (this.isAsync) {
            return new Promise((resolve, reject) => {
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

                    this.set(key, data, options)
                        .then(() => resolve(data))
                        .catch((error) => reject(error));
                } catch (error) {
                    reject(error);
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
            } catch (error) {
                throw error;
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
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
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const value = await this.get(key, options);
                    resolve(value !== null && value !== undefined);
                } catch (error) {
                    reject(error);
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                        const data: any = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new DatabaseError('Value is not an object');
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    } else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result: any = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                const data: any = this.get(k, options);

                if (typeof data !== 'object') {
                    throw new DatabaseError('Value is not an object');
                };
                const keys: string[] = Object.keys(data);

                const result: any = {};
                for (const k of keys) {
                    if (k.startsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            } else {
                const data = this.driver.read();
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                        const data: any = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new DatabaseError('Value is not an object');
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    } else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result: any = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                const data: any = this.get(k, options);
                if (typeof data !== 'object') {
                    throw new DatabaseError('Value is not an object');
                };
                const keys: string[] = Object.keys(data);

                const result: any = {};
                for (const k of keys) {
                    if (k.endsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            } else {
                const data = this.driver.read();
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
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                        const data: any = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new DatabaseError('Value is not an object');
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.includes(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    } else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result: any = {};
                        for (const k of keys) {
                            if (k.includes(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                const data: any = this.get(k, options);

                if (typeof data !== 'object') {
                    throw new DatabaseError('Value is not an object');
                };
                const keys: string[] = Object.keys(data);

                const result: any = {};
                for (const k of keys) {
                    if (k.includes(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            } else {
                const data = this.driver.read();
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
                    const data = await this.driver.read();
                    resolve(Object.keys(data));
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.driver.read();
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
                    const data = await this.driver.read();
                    resolve(Object.values(data));
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.driver.read();
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
    public async all(): Promise<any>;
    public all(): any;
    public all(): Promise<any> | any {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.driver.read();
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return this.driver.read();
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
    public clear(): Promise<boolean> | boolean {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.driver.clear();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            this.driver.clear();
            return true;
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
<<<<<<< Updated upstream
        if (this.driver instanceof MongoDBDriver) {
            return await this.driver.init();
=======
        if (this.driver instanceof MongoDBDriver || this.driver instanceof PostgreSQLDriver || this.driver instanceof MySQLDriver) {
            return await this.driver.init(this.tableName);
>>>>>>> Stashed changes
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
        if (this.driver instanceof MongoDBDriver || this.driver instanceof PostgreSQLDriver || this.driver instanceof MySQLDriver) {
            return await this.driver.close();
        } else {
            throw new DatabaseError('This driver does not support the disconnect method');
        }
    };

    // End Async methods //
};