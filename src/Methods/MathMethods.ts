import { GoodDB } from "../good.db";
import { MathSigns, methodOptions } from "../Types";
import { DatabaseError } from "../utils/ErrorMessage";

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
export function add(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number> {
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
}

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
export function subtract(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number> {
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
}

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
export function multiply(this: GoodDB, key: string, value: number, options?: methodOptions): number | Promise<number> {
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
}

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
export function double(this: GoodDB, key: string, options?: methodOptions): number | Promise<number> {
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
}

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
export function math(this: GoodDB, key: string, mathSign: MathSigns, value: number, options?: methodOptions): number | Promise<number> {
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

                await this.set(key, data, options);
                resolve(data);
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
}
