import { MemoryDriver } from "./Drivers/Cache";
import { JSONDriver } from "./Drivers/JSON";
import { MongoDBDriver } from "./Drivers/Mongo";
import { MySQLDriver } from "./Drivers/MySQL";
import { PostgreSQLDriver } from "./Drivers/PostgreSQL";
import { SQLiteDriver } from "./Drivers/SQLite";
import { YMLDriver } from "./Drivers/YML";
export type goodDBOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
    table?: string;
    timeIsEnabled?: boolean;
    cache?: {
        isEnabled?: boolean;
        capacity?: number;
    };
};
export type JSONDriverOptions = {
    path?: string;
    format?: boolean;
};
export type methodOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
};
export interface MongoDBDriverOptions {
    uri: string;
    database?: string;
}
export type SQLiteDriverOptions = {
    path?: string;
};
export type YMLDriverOptions = {
    path?: string;
};
export type MathSigns = '+' | '-' | '*' | '×' | '/';
export type AllDataReturns = any | DatabaseDesignArray;
export type DatabaseDesignArray = {
    key: string;
    value: any;
}[];
export type Drivers = JSONDriver | SQLiteDriver | YMLDriver | MemoryDriver | MongoDBDriver | PostgreSQLDriver | MySQLDriver;
export type DriversClassType = {
    init(table: string): void | Promise<boolean>;
    tables(): string[] | Promise<string[]>;
    setRowByKey(table: string, key: string, value: any): boolean | Promise<boolean>;
    getAllRows(table: string): any | Promise<[any, boolean]>;
    getRowByKey(table: string, key: string): any | Promise<any>;
    deleteRowByKey(table: string, key: string): number | Promise<number | null>;
    deleteAllRows(table: string): boolean | Promise<boolean>;
    close?(): boolean | Promise<boolean>;
};
export type AllTypes = any | number | string | boolean | undefined | null;
export interface IGoodDB {
    /**
     * Set a value to a key.
     * @param key - The key to set the value to.
     * @param value - The value to set.
     * @param options - The options to use.
     * @returns A boolean indicating the success of the operation or a promise that resolves to a boolean.
     */
    set(key: string, value: any, options?: methodOptions): boolean | Promise<boolean>;
    /**
     * Get the value associated with a key.
     * @param key - The key to get the value from.
     * @param options - The options to use.
     * @returns The value associated with the key or a promise that resolves to the value.
     */
    get(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Delete a key and its associated value.
     * @param key - The key to delete.
     * @param options - The options to use.
     * @returns A boolean indicating the success of the operation or a promise that resolves to a boolean.
     */
    delete(key: string, options?: methodOptions): boolean | Promise<boolean>;
    /**
     * Push a value to an array stored in a key.
     * @param key - The key of the array to push the value to.
     * @param value - The value to push.
     * @param options - The options to use.
     * @returns The new length of the array or a promise that resolves to the new length.
     */
    push(key: string, value: any, options?: methodOptions): number | Promise<number>;
    /**
     * Remove and return the first element of an array stored in a key.
     * @param key - The key of the array to shift the value from.
     * @param options - The options to use.
     * @returns The shifted value or a promise that resolves to the shifted value.
     */
    shift(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Add a value to the beginning of an array stored in a key.
     * @param key - The key of the array to unshift the value to.
     * @param value - The value to unshift.
     * @param options - The options to use.
     * @returns The new length of the array or a promise that resolves to the new length.
     */
    unshift(key: string, value: any, options?: methodOptions): number | Promise<number>;
    /**
     * Remove and return the last element of an array stored in a key.
     * @param key - The key of the array to pop the value from.
     * @param options - The options to use.
     * @returns The popped value or a promise that resolves to the popped value.
     */
    pop(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Remove one or all occurrences of a value from an array stored in a key.
     * @param key - The key of the array to pull the value from.
     * @param valueOrCallback - The value or callback function to use to pull the value.
     * @param pullAll - Whether to pull all occurrences or just the first one.
     * @param options - The options to use.
     * @returns A boolean indicating whether any value was pulled or a promise that resolves to a boolean.
     */
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean | Promise<boolean>;
    /**
     * Find values in an array stored in a key that satisfy a callback function.
     * @param key - The key of the array to find values in.
     * @param callback - The callback function to use for finding values.
     * @param options - The options to use.
     * @returns The value or a promise that resolves to the value.
     */
    find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any | Promise<any>;
    /**
     * Get distinct values from an array stored in a key.
     * @param key - The key of the array to get distinct values from.
     * @param value - The value or callback function to use for getting distinct values.
     * @param options - The options to use.
     * @returns A boolean indicating whether any value was found or a promise that resolves to a boolean.
     */
    distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean | Promise<boolean>;
    /**
     * Add a number to the value stored in a key.
     * @param key - The key of the value to add to.
     * @param value - The number to add.
     * @param options - The options to use.
     * @returns The new value or a promise that resolves to the new value.
     */
    add(key: string, value: number, options?: methodOptions): number | Promise<number>;
    /**
     * Multiply the value stored in a key by a number.
     * @param key - The key of the value to multiply.
     * @param value - The number to multiply by.
     * @param options - The options to use.
     * @returns The new value or a promise that resolves to the new value.
     */
    multiply(key: string, value: number, options?: methodOptions): number | Promise<number>;
    /**
     * Double the value stored in a key.
     * @param key - The key of the value to double.
     * @param options - The options to use.
     * @returns The new value or a promise that resolves to the new value.
     */
    double(key: string, options?: methodOptions): number | Promise<number>;
    /**
     * Subtract a number from the value stored in a key.
     * @param key - The key of the value to subtract from.
     * @param value - The number to subtract.
     * @param options - The options to use.
     * @returns The new value or a promise that resolves to the new value.
     */
    subtract(key: string, value: number, options?: methodOptions): number | Promise<number>;
    /**
     * Perform a mathematical operation on the value stored in a key.
     * @param key - The key of the value to perform the operation on.
     * @param mathSign - The mathematical sign to use for the operation.
     * @param value - The number to use for the operation.
     * @param options - The options to use.
     * @returns The new value or a promise that resolves to the new value.
     */
    math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): number | Promise<number>;
    /**
     * Get the type of the value stored in a key.
     * @param key - The key of the value to get the type of.
     * @param options - The options to use.
     * @returns The type of the value or a promise that resolves to the type.
     */
    type(key: string, options?: methodOptions): string | Promise<string>;
    /**
     * Get the size of the value stored in a key.
     * @param key - The key of the value to get the size of.
     * @param options - The options to use.
     * @returns The size of the value or a promise that resolves to the size.
     */
    size(key: string, options?: methodOptions): number | Promise<number>;
    /**
     * Check if a key exists.
     * @param key - The key to check.
     * @param options - The options to use.
     * @returns A boolean indicating whether the key exists or a promise that resolves to a boolean.
     */
    has(key: string, options?: methodOptions): boolean | Promise<boolean>;
    /**
     * Check if a key starts with a specific value.
     * @param key - The key to check.
     * @param options - The options to use.
     * @returns The value or a promise that resolves to the value.
     */
    startsWith(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Check if a key ends with a specific value.
     * @param key - The key to check.
     * @param options - The options to use.
     * @returns The value or a promise that resolves to the value.
     */
    endsWith(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Check if a key includes a specific value.
     * @param key - The key to check.
     * @param options - The options to use.
     * @returns The value or a promise that resolves to the value.
     */
    includes(key: string, options?: methodOptions): any | Promise<any>;
    /**
     * Get all the keys in the database.
     * @returns An array of keys or a promise that resolves to an array of keys.
     */
    keys(): string[] | Promise<string[]>;
    /**
     * Get all the values in the database.
     * @returns An array of values or a promise that resolves to an array of values.
     */
    values(): any[] | Promise<any[]>;
    /**
     * Get all the data in the database.
     * @param type - The type of data to return ('object' or 'array').
     * @returns All the data or a promise that resolves to all the data.
     */
    all(type?: 'object' | 'array' | undefined): AllDataReturns | Promise<AllDataReturns>;
    /**
     * Clear the database.
     * @returns A boolean indicating the success of the operation or a promise that resolves to a boolean.
     */
    clear(): boolean | Promise<boolean>;
    /**
     * Get a table from the database.
     * @param name - The name of the table.
     * @returns An instance of the IGoodDB interface or a promise that resolves to an instance of the IGoodDB interface.
     */
    table(name: string): IGoodDB | Promise<IGoodDB>;
    /**
     * Connect to the database.
     * @returns A promise that resolves to a boolean indicating the success of the connection.
     */
    connect(): Promise<boolean>;
    /**
     * Disconnect from the database.
     * @returns A promise that resolves to a boolean indicating the success of the disconnection.
     */
    disconnect(): Promise<boolean>;
}
export interface IAsyncGoodDB {
    /**
     * Set a value to a key.
     * @param key - The key to set the value to.
     * @param value - The value to set.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.set('key', 'value');
     * ```
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.set('key', 'value', {
     *     nested: 'nested',
     *     nestedIsEnabled: true
     * });
     * ```
     */
    set(key: string, value: any, options?: methodOptions): Promise<boolean>;
    /**
     * Get the value associated with a key.
     * @param key - The key to get the value from.
     * @param options - The options to use.
     * @returns A promise that resolves to the value associated with the key.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.get('key');
     * ```
     */
    get(key: string, options?: methodOptions): Promise<any>;
    /**
     * Delete a key and its associated value.
     * @param key - The key to delete.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.delete('key');
     * ```
     */
    delete(key: string, options?: methodOptions): Promise<boolean>;
    /**
     * Push a value to an array stored in a key.
     * @param key - The key of the array to push the value to.
     * @param value - The value to push.
     * @param options - The options to use.
     * @returns A promise that resolves to the new length of the array.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.push('key', 'value');
     * ```
     */
    push(key: string, value: any, options?: methodOptions): Promise<number>;
    /**
     * Remove and return the first element of an array stored in a key.
     * @param key - The key of the array to shift the value from.
     * @param options - The options to use.
     * @returns A promise that resolves to the shifted value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.shift('key');
     * ```
     */
    shift(key: string, options?: methodOptions): Promise<any>;
    /**
     * Add a value to the beginning of an array stored in a key.
     * @param key - The key of the array to unshift the value to.
     * @param value - The value to unshift.
     * @param options - The options to use.
     * @returns A promise that resolves to the new length of the array.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.unshift('key', 'value');
     * ```
     */
    unshift(key: string, value: any, options?: methodOptions): Promise<number>;
    /**
     * Remove and return the last element of an array stored in a key.
     * @param key - The key of the array to pop the value from.
     * @param options - The options to use.
     * @returns A promise that resolves to the popped value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.pop('key');
     * ```
     */
    pop(key: string, options?: methodOptions): Promise<any>;
    /**
     * Remove one or all occurrences of a value from an array stored in a key.
     * @param key - The key of the array to pull the value from.
     * @param valueOrCallback - The value or callback function to use to pull the value.
     * @param pullAll - Whether to pull all occurrences or just the first one.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating whether any value was pulled.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.pull('key', 'value');
     * ```
     */
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    /**
     * Find a value in an array stored in a key.
     * @param key - The key of the array to find the value in.
     * @param callback - The callback function to use for finding the value.
     * @param options - The options to use.
     * @returns A promise that resolves to the value found.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.find('key', (value) => value === 'value');
     * ```
     */
    find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): Promise<any>;
    /**
     * Remove all duplicate values from an array stored in a key.
     * @param key - The key of the array to remove duplicate values from.
     * @param value - The value to remove.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating whether any value was removed.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.distinct('key', 'value');
     * ```
     */
    distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): Promise<boolean>;
    /**
     * Add a value to a key.
     * @param key - The key to add the value to.
     * @param value - The value to add.
     * @param options - The options to use.
     * @returns A promise that resolves to the new value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.add('key', 1);
     * ```
     */
    add(key: string, value: number, options?: methodOptions): Promise<number>;
    /**
     * Multiply a value to a key.
     * @param key - The key to multiply the value to.
     * @param value - The value to multiply.
     * @param options - The options to use.
     * @returns A promise that resolves to the new value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.multiply('key', 2);
     * ```
     */
    multiply(key: string, value: number, options?: methodOptions): Promise<number>;
    /**
     * Double the value of a key.
     * @param key - The key to double the value of.
     * @param options - The options to use.
     * @returns A promise that resolves to the new value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.double('key');
     * ```
     */
    double(key: string, options?: methodOptions): Promise<number>;
    /**
     * Subtract a value from a key.
     * @param key - The key to subtract the value from.
     * @param value - The value to subtract.
     * @param options - The options to use.
     * @returns A promise that resolves to the new value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.subtract('key', 1);
     * ```
     */
    subtract(key: string, value: number, options?: methodOptions): Promise<number>;
    /**
     * Perform a mathematical operation on a key.
     * @param key - The key to perform the mathematical operation on.
     * @param mathSign - The mathematical sign to use.
     * @param value - The value to use in the mathematical operation.
     * @param options - The options to use.
     * @returns A promise that resolves to the result of the mathematical operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.math('key', '+', 1);
     * ```
     */
    math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): Promise<number>;
    /**
     * Get the type of a key.
     * @param key - The key to get the type of.
     * @param options - The options to use.
     * @returns A promise that resolves to a string representing the type of the key.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.type('key');
     * ```
     */
    type(key: string, options?: methodOptions): Promise<string>;
    /**
     * Get the size of a key.
     * @param key - The key to get the size of.
     * @param options - The options to use.
     * @returns A promise that resolves to the size of the key.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.size('key');
     * ```
     */
    size(key: string, options?: methodOptions): Promise<number>;
    /**
     * Check if a key exists.
     * @param key - The key to check if it exists.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating whether the key exists.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.has('key');
     * ```
     */
    has(key: string, options?: methodOptions): Promise<boolean>;
    /**
     * Get all the values that start with a key.
     * @param key - The key to check if it starts with the value.
     * @param options - The options to use.
     * @returns A promise that resolves to the values that start with the key.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.startsWith('key');
     * ```
     */
    startsWith(key: string, options?: methodOptions): Promise<any>;
    /**
     * Get all the values that end with a key.
     * @param key - The key to check if it ends with the value.
     * @param options - The options to use.
     * @returns A promise that resolves to the values that end with the key.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.endsWith('key');
     * ```
     */
    endsWith(key: string, options?: methodOptions): Promise<any>;
    /**
     * Check if a key includes a value.
     * @param key - The key to check if it includes the value.
     * @param options - The options to use.
     * @returns A promise that resolves to a boolean indicating whether the key includes the value.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.includes('key');
     * ```
     */
    includes(key: string, options?: methodOptions): Promise<any>;
    /**
     * Get all the keys.
     * @returns A promise that resolves to an array of all the keys.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.keys();
     * ```
     */
    keys(): Promise<string[]>;
    /**
     * Get all the values.
     * @returns A promise that resolves to an array of all the values.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.values();
     * ```
     */
    values(): Promise<any[]>;
    /**
     * Get all the data.
     * @param type - The type to get the data in.
     * @returns A promise that resolves to the data.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.all('array');
     * ```
     */
    all(type?: 'object' | 'array' | undefined): Promise<AllDataReturns>;
    /**
     * Clear all the data.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.clear();
     * ```
     */
    clear(): Promise<boolean>;
    /**
     * Get a table.
     * @param name - The name of the table to get.
     * @returns A promise that resolves to a new instance of AsyncGoodDB representing the table.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * const table = await db.table('table');
     * ```
     */
    table(name: string): Promise<IAsyncGoodDB>;
    /**
     * Connect to the database.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * ```
     */
    connect(): Promise<boolean>;
    /**
     * Disconnect from the database.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @example
     * ```typescript
     * const db = new GoodDB(new MongoDBDriver({
     *     uri: "..."
     * }));
     * await db.connect();
     * await db.disconnect();
     * ```
     */
    disconnect(): Promise<boolean>;
}
export interface ISyncGoodDB {
    /**
     * Set a value to a key
     * @param key - The key to set the value to
     * @param value - The value to set
     * @param options - The options to use
     * @returns A boolean
     * @example Set a value to a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.set('key', 'value');
     * ```
     * @example Set a value to a key with options
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *   path: './database.json'
     * }));
     *
     * db.set('key', 'value', {
     *  nested: 'nested',
     *  nestedIsEnabled: true
     * });
     * ```
     */
    set(key: string, value: any, options?: methodOptions): boolean;
    /**
     * Get a value from a key
     * @param key - The key to get the value from
     * @param options - The options to use
     * @returns A value
     * @example Get a value from a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.get('key');
     * ```
     */
    get(key: string, options?: methodOptions): any;
    /**
     * Delete a key
     * @param key - The key to delete
     * @param options - The options to use
     * @returns A boolean
     * @example Delete a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.delete('key');
     * ```
     */
    delete(key: string, options?: methodOptions): boolean;
    /**
     * Push a value to an array stored in a key
     * @param key - The key of the array to push the value to
     * @param value - The value to push
     * @param options - The options to use
     * @returns A number
     * @example Push a value to an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.push('key', 'value');
     * ```
     */
    push(key: string, value: any, options?: methodOptions): number;
    /**
     * Remove and return the first element of an array stored in a key
     * @param key - The key of the array to shift the value from
     * @param options - The options to use
     * @returns A value
     * @example Remove and return the first element of an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.shift('key');
     * ```
     */
    shift(key: string, options?: methodOptions): any;
    /**
     * Add a value to the beginning of an array stored in a key
     * @param key - The key of the array to unshift the value to
     * @param value - The value to unshift
     * @param options - The options to use
     * @returns A number
     * @example Add a value to the beginning of an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.unshift('key', 'value');
     * ```
     */
    unshift(key: string, value: any, options?: methodOptions): number;
    /**
     * Remove and return the last element of an array stored in a key
     * @param key - The key of the array to pop the value from
     * @param options - The options to use
     * @returns A value
     * @example Remove and return the last element of an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.pop('key');
     * ```
     */
    pop(key: string, options?: methodOptions): any;
    /**
     * Remove one or all occurrences of a value from an array stored in a key
     * @param key - The key of the array to pull the value from
     * @param valueOrCallback - The value or callback function to use to pull the value
     * @param pullAll - Whether to pull all occurrences or just the first one
     * @param options - The options to use
     * @returns A boolean
     * @example Remove one or all occurrences of a value from an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.pull('key', 'value');
     * ```
     */
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => AllTypes, pullAll?: boolean, options?: methodOptions): boolean;
    /**
     * Find a value in an array stored in a key
     * @param key - The key of the array to find the value in
     * @param callback - The callback function to use for finding the value
     * @param options - The options to use
     * @returns A value
     * @example Find a value in an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.find('key', (value) => value === 'value');
     * ```
     */
    find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions): any;
    /**
     * Remove all duplicate values from an array stored in a key
     * @param key - The key of the array to remove duplicate values from
     * @param value - The value to remove
     * @param options - The options to use
     * @returns A boolean
     * @example Remove all duplicate values from an array stored in a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.distinct('key', 'value');
     * ```
     */
    distinct(key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions): boolean;
    /**
     * Add a value to a key
     * @param key - The key to add the value to
     * @param value - The value to add
     * @param options - The options to use
     * @returns A number
     * @example Add a value to a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.add('key', 1);
     * ```
     */
    add(key: string, value: number, options?: methodOptions): number;
    /**
     * Multiply a value to a key
     * @param key - The key to multiply the value to
     * @param value - The value to multiply
     * @param options - The options to use
     * @returns A number
     * @example Multiply a value to a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.multiply('key', 2);
     * ```
     */
    multiply(key: string, value: number, options?: methodOptions): number;
    /**
     * Double the value of a key
     * @param key - The key to double the value of
     * @param options - The options to use
     * @returns A number
     * @example Double the value of a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.double('key');
     * ```
     */
    double(key: string, options?: methodOptions): number;
    /**
     * Subtract a value from a key
     * @param key - The key to subtract the value from
     * @param value - The value to subtract
     * @param options - The options to use
     * @returns A number
     * @example Subtract a value from a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.subtract('key', 1);
     * ```
     */
    subtract(key: string, value: number, options?: methodOptions): number;
    /**
     * Perform a mathematical operation on a key
     * @param key - The key to perform the mathematical operation on
     * @param mathSign - The mathematical sign to use
     * @param value - The value to use in the mathematical operation
     * @param options - The options to use
     * @returns A number
     * @example Perform a mathematical operation on a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.math('key', '+', 1);
     * ```
     */
    math(key: string, mathSign: MathSigns, value: number, options?: methodOptions): number;
    /**
     * Get the type of a key
     * @param key - The key to get the type of
     * @param options - The options to use
     * @returns A string
     * @example Get the type of a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.type('key');
     * ```
     */
    type(key: string, options?: methodOptions): string;
    /**
     * Get the size of a key
     * @param key - The key to get the size of
     * @param options - The options to use
     * @returns A number
     * @example Get the size of a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.size('key');
     * ```
     */
    size(key: string, options?: methodOptions): number;
    /**
     * Check if a key exists
     * @param key - The key to check if it exists
     * @param options - The options to use
     * @returns A boolean
     * @example Check if a key exists
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.has('key');
     * ```
     */
    has(key: string, options?: methodOptions): boolean;
    /**
     * Get all the values that start with a key
     * @param key - The key to check if it starts with the value
     * @param options - The options to use
     * @returns A value
     * @example Get all the values that start with a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.startsWith('key');
     * ```
     */
    startsWith(key: string, options?: methodOptions): any;
    /**
     * Get all the values that end with a key
     * @param key - The key to check if it ends with the value
     * @param options - The options to use
     * @returns A value
     * @example Get all the values that end with a key
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.endsWith('key');
     * ```
     */
    endsWith(key: string, options?: methodOptions): any;
    /**
     * Check if a key includes a value
     * @param key - The key to check if it includes the value
     * @param options - The options to use
     * @returns A value
     * @example Check if a key includes a value
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.includes('key');
     * ```
     */
    includes(key: string, options?: methodOptions): any;
    /**
     * Get all the keys
     * @returns An array of all the keys
     * @example Get all the keys
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.keys();
     * ```
     */
    keys(): string[];
    /**
     * Get all the values
     * @returns An array of all the values
     * @example Get all the values
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.values();
     * ```
     */
    values(): any[];
    /**
     * Get all the data
     * @param type - The type to get the data in
     * @returns The data
     * @example Get all the data
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.all('array');
     * ```
     */
    all(type?: 'object' | 'array' | undefined): AllDataReturns;
    /**
     * Clear all the data
     * @returns A boolean
     * @example Clear all the data
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.clear();
     * ```
     */
    clear(): boolean;
    /**
     * Get a table
     * @param name - The name of the table to get
     * @returns A new instance of GoodDB representing the table
     * @example Get a table
     * ```javascript
     * const db = new GoodDB(new JSONDriver({
     *    path: './database.json'
     * }));
     * db.table('table');
     * ```
     */
    table(name: string): ISyncGoodDB;
}
