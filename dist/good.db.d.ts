import { AllDataReturns, AllTypes, Drivers, goodDBOptions, IGoodDB, MathSigns, methodOptions } from "./Types";
import { LRUCache } from "./utils/Caching";
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
    readonly options?: goodDBOptions | undefined;
    readonly driver: Drivers;
    readonly tableName: string;
    readonly nested: {
        nested: string;
        isEnabled: boolean;
    };
    readonly cacheIsEnabled: boolean;
    readonly isAsync: boolean;
    cacheService: LRUCache | undefined;
    constructor(driver?: Drivers, options?: goodDBOptions | undefined);
    private get getNestedOptions();
    private checkKey;
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
    set(key: string, value: any, options?: methodOptions): Promise<boolean>;
    set(key: string, value: any, options?: methodOptions): boolean;
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
    get(key: string, options?: methodOptions): Promise<any>;
    get(key: string, options?: methodOptions): any;
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
    delete(key: string, options: methodOptions): Promise<boolean>;
    delete(key: string, options?: methodOptions): boolean;
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
    push(key: string, value: any, options?: methodOptions): Promise<number>;
    push(key: string, value: any, options?: methodOptions): number;
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
    shift(key: string, options?: methodOptions): Promise<any>;
    shift(key: string, options?: methodOptions): any;
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
    unshift(key: string, value: any, options?: methodOptions): Promise<number>;
    unshift(key: string, value: any, options?: methodOptions): number;
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
    pop(key: string, options?: methodOptions): Promise<any>;
    pop(key: string, options?: methodOptions): any;
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
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean;
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
    find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): Promise<any>;
    find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any;
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
    distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): Promise<boolean>;
    distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean;
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
    add(key: string, value: number, options?: methodOptions): Promise<number>;
    add(key: string, value: number, options?: methodOptions): number;
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
    multiply(key: string, value: number, options?: methodOptions): Promise<number>;
    multiply(key: string, value: number, options?: methodOptions): number;
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
    double(key: string, options?: methodOptions): Promise<number>;
    double(key: string, options?: methodOptions): number;
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
    subtract(key: string, value: number, options?: methodOptions): Promise<number>;
    subtract(key: string, value: number, options?: methodOptions): number;
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
    math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): Promise<number>;
    math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): number;
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
    type(key: string, options?: methodOptions): Promise<string>;
    type(key: string, options?: methodOptions): string;
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
    size(key: string, options?: methodOptions): Promise<number>;
    size(key: string, options?: methodOptions): number;
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
    has(key: string, options?: methodOptions): Promise<boolean>;
    has(key: string, options?: methodOptions): boolean;
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
    startsWith(key: string, options?: methodOptions): Promise<any>;
    startsWith(key: string, options?: methodOptions): any;
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
    endsWith(key: string, options?: methodOptions): Promise<any>;
    endsWith(key: string, options?: methodOptions): any;
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
    includes(key: string, options?: methodOptions): Promise<any>;
    includes(key: string, options?: methodOptions): any;
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
    keys(): Promise<string[]>;
    keys(): string[];
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
    values(): Promise<any[]>;
    values(): any[];
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
    all(type?: 'object' | 'array' | undefined): Promise<AllDataReturns>;
    all(type?: 'object' | 'array' | undefined): AllDataReturns;
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
    clear(): Promise<boolean>;
    clear(): boolean;
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
    table(name: string): Promise<GoodDB>;
    table(name: string): GoodDB;
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
    connect(): Promise<boolean>;
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
    disconnect(): Promise<boolean>;
}
