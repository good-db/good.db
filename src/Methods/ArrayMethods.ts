import { GoodDB } from "../good.db";
import { AllTypes, methodOptions } from "../Types";
import { DatabaseError } from "../utils/ErrorMessage";

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
export function push(this: GoodDB, key: string, value: any, options?: methodOptions): number | Promise<number> {
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
                    return;
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
}

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
export function shift(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
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
                    return;
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
}

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
export function unshift(this: GoodDB, key: string, value: any, options?: methodOptions): number | Promise<number> {
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
                    return;
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
}

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
export function pop(this: GoodDB, key: string, options?: methodOptions): any | Promise<any> {
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
                    return;
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
}

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
export function pull(this: GoodDB, key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean | Promise<boolean> {
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

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data: any = await this.get(key, options);
                if (!data) {
                    resolve(false);
                    return;
                }

                if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
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
        }

        if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
            return pullFromArray(data, data);
        } else {
            if (!Array.isArray(data)) {
                throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
            }
            return pullFromArray(data, data);
        }
    }
}

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
export function find(this: GoodDB, key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any | Promise<any> {
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
}

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
export function filter(this: GoodDB, key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any[] | Promise<any[]> {
    options = options || this.getNestedOptions;
    this.checkKey(key);
    if (typeof callback !== 'function') throw new DatabaseError(`GoodDB requires the callback to be a function. Provided: ${typeof callback}`);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.get(key, options);
                if (!Array.isArray(data)) {
                    throw new DatabaseError('Value is not an array');
                }
                resolve(data.filter(callback));
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.get(key, options);
        if (!Array.isArray(data)) {
            throw new DatabaseError('Value is not an array');
        }
        return data.filter(callback);
    }
}

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
export function findAndUpdate(this: GoodDB, key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions): any | Promise<any> {
    options = options || this.getNestedOptions;
    this.checkKey(key);
    if (typeof findCallback !== 'function') throw new DatabaseError(`GoodDB requires the findCallback to be a function. Provided: ${typeof findCallback}`);
    if (typeof updateCallback !== 'function') throw new DatabaseError(`GoodDB requires the updateCallback to be a function. Provided: ${typeof updateCallback}`);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.get(key, options);
                if (!Array.isArray(data)) {
                    throw new DatabaseError('Value is not an array');
                }
                const index = data.findIndex(findCallback);
                if (index === -1) {
                    return resolve(undefined);
                }
                data[index] = updateCallback(data[index], index, data);
                await this.set(key, data, options);
                resolve(data[index]);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.get(key, options);
        if (!Array.isArray(data)) {
            throw new DatabaseError('Value is not an array');
        }
        const index = data.findIndex(findCallback);
        if (index === -1) {
            return undefined;
        }
        data[index] = updateCallback(data[index], index, data);
        this.set(key, data, options);
        return data[index];
    }
}

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
export function findAndUpdateMany(this: GoodDB, key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions): any[] | Promise<any[]> {
    options = options || this.getNestedOptions;
    this.checkKey(key);
    if (typeof findCallback !== 'function') throw new DatabaseError(`GoodDB requires the findCallback to be a function. Provided: ${typeof findCallback}`);
    if (typeof updateCallback !== 'function') throw new DatabaseError(`GoodDB requires the updateCallback to be a function. Provided: ${typeof updateCallback}`);

    if (this.isAsync) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.get(key, options);
                if (!Array.isArray(data)) {
                    throw new DatabaseError('Value is not an array');
                }
                const updatedElements: any[] = [];
                const indices = data.map((item, index) => findCallback(item, index, data) ? index : -1).filter(i => i !== -1);
                for (const index of indices) {
                    data[index] = updateCallback(data[index], index, data);
                    updatedElements.push(data[index]);
                }
                await this.set(key, data, options);
                resolve(updatedElements);
            } catch (error: any) {
                reject(new Error(error));
            }
        });
    } else {
        const data = this.get(key, options);
        if (!Array.isArray(data)) {
            throw new DatabaseError('Value is not an array');
        }
        const updatedElements: any[] = [];
        const indices = data.map((item, index) => findCallback(item, index, data) ? index : -1).filter(i => i !== -1);
        for (const index of indices) {
            data[index] = updateCallback(data[index], index, data);
            updatedElements.push(data[index]);
        }
        this.set(key, data, options);
        return updatedElements;
    }
}

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
export function distinct(this: GoodDB, key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean | Promise<boolean> {
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
                    }
                } else {
                    newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
                    newData = newData.map(item => JSON.parse(item));
                }
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
            }
        } else {
            newData = Array.from(new Set(data.map(item => JSON.stringify(item))));
            newData = newData.map(item => JSON.parse(item));
        }
        this.set(key, newData, options);
        return true;
    }
}
