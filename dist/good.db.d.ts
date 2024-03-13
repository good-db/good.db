import { CacheDriver } from "./Drivers/Cache";
import { JSONDriver } from "./Drivers/JSON";
import { MongoDBDriver } from "./Drivers/Mongo";
import { SQLiteDriver } from "./Drivers/SQLite";
import { YMLDriver } from "./Drivers/YML";
import { goodDBOptions, methodOptions } from "./Types";
export default class GoodDB {
    driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver;
    nested: {
        nested: string;
        isEnabled: boolean;
    };
    isAsync: boolean;
    /**
     * Create a new instance of GoodDB
     * @param driver The driver to use
     * @param options The options for the database
     * @example
     * ```javascript
     * const db = new GoodDB(new JSONDriver(), {
     * nested: '..',
     * nestedIsEnabled: true
     * });
     */
    constructor(driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver, options?: goodDBOptions);
    set(key: string, value: any, options?: methodOptions): Promise<boolean>;
    set(key: string, value: any, options?: methodOptions): boolean;
    get(key: string, options?: methodOptions): Promise<any>;
    get(key: string, options?: methodOptions): any;
    has(key: string, options?: methodOptions): Promise<boolean>;
    has(key: string, options?: methodOptions): boolean;
    math(key: string, mathSign: string, value: number, options?: methodOptions): Promise<number>;
    math(key: string, mathSign: string, value: number, options?: methodOptions): number;
    startsWith(key: string, options?: methodOptions): Promise<any>;
    startsWith(key: string, options?: methodOptions): any;
    endsWith(key: string, options?: methodOptions): Promise<any>;
    endsWith(key: string, options?: methodOptions): any;
    push(key: string, value: any, options?: methodOptions): Promise<number>;
    push(key: string, value: any, options?: methodOptions): number;
    pull(key: string, valueOrCallback: (e: any, i: number, a: any) => any | number | string | boolean | number | undefined | null, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): boolean;
    add(key: string, value: number, options?: methodOptions): Promise<number>;
    add(key: string, value: number, options?: methodOptions): number;
    subtract(key: string, value: number, options?: methodOptions): Promise<number>;
    subtract(key: string, value: number, options?: methodOptions): number;
    delete(key: string, options: methodOptions): Promise<boolean>;
    delete(key: string, options?: methodOptions): boolean;
    all(): Promise<any>;
    all(): any;
    clear(): Promise<boolean>;
    clear(): boolean;
}
