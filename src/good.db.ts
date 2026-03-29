import { MongoDBDriver } from "./Drivers/Mongo";
import { MySQLDriver } from "./Drivers/MySQL";
import { PostgreSQLDriver } from "./Drivers/PostgreSQL";
import { SQLiteDriver } from "./Drivers/SQLite";
import { Drivers, goodDBOptions, IGoodDB, MathSigns, methodOptions } from "./Types";
import { DatabaseError } from "./utils/ErrorMessage";
import { LRUCache } from "./utils/Caching";
import { checkDriverIsAsync } from "./utils/Utils";

/**
 * The main class for the GoodDB package
 * @example Using JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({ path: './database.json' }));
 * ```
 * @example Using MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({ uri: "..." }));
 * await db.connect();
 * ```
 */
export default class GoodDB implements IGoodDB {
    public readonly driver: Drivers;
    public readonly tableName: string;
    public readonly nested: { nested: string; isEnabled: boolean };
    public readonly cacheIsEnabled: boolean;
    public readonly isAsync: boolean;
    public cacheService: LRUCache | undefined;
    public readonly options?: goodDBOptions;

    constructor(driver?: Drivers, options?: goodDBOptions) {
        this.driver = driver || new SQLiteDriver({ path: './database.sqlite' });
        this.options = options;
        this.nested = {
            nested: options?.nested || '..',
            isEnabled: options?.nestedIsEnabled ? true : false,
        };
        this.tableName = options?.table || 'gooddb';
        this.isAsync = checkDriverIsAsync(this.driver);

        if (!this.isAsync) {
            this.driver.init(this.tableName);
        }
        this.cacheIsEnabled = options?.cache?.isEnabled ?? false;
        this.cacheService = this.cacheIsEnabled ? new LRUCache(options?.cache?.capacity ?? 1024) : undefined;
    }

    public get getNestedOptions(): { nested: string; nestedIsEnabled: boolean } {
        return {
            nested: this.nested.nested ?? '..',
            nestedIsEnabled: this.nested.isEnabled ?? false,
        };
    }

    public checkKey(key: string): void {
        if (!key || typeof key !== 'string' || !key?.trim()) {
            throw new DatabaseError(`GoodDB requires keys to be a string. Provided: ${key?.trim() ? typeof key : 'Null'}`);
        }
    }

    // Database Methods - imported via prototype
    public set!: (key: string, value: any, options?: methodOptions) => boolean | Promise<boolean>;
    public get!: (key: string, options?: methodOptions) => any | Promise<any>;
    public delete!: (key: string, options?: methodOptions) => boolean | Promise<boolean>;
    public setMany!: (data: Record<string, any>, options?: methodOptions) => boolean | Promise<boolean>;
    public getMany!: (keys: string[], options?: methodOptions) => Record<string, any> | Promise<Record<string, any>>;
    public deleteMany!: (keys: string[], options?: methodOptions) => boolean | Promise<boolean>;

    // Array Methods - imported via prototype
    public push!: (key: string, value: any, options?: methodOptions) => number | Promise<number>;
    public shift!: (key: string, options?: methodOptions) => any | Promise<any>;
    public unshift!: (key: string, value: any, options?: methodOptions) => number | Promise<number>;
    public pop!: (key: string, options?: methodOptions) => any | Promise<any>;
    public pull!: (key: string, valueOrCallback: (e: any, i: number, a: any) => any, pullAll?: boolean, options?: methodOptions) => boolean | Promise<boolean>;
    public find!: (key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions) => any | Promise<any>;
    public filter!: (key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions) => any[] | Promise<any[]>;
    public findAndUpdate!: (key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => any | Promise<any>;
    public findAndUpdateMany!: (key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => any[] | Promise<any[]>;
    public distinct!: (key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => boolean | Promise<boolean>;

    // Math Methods - imported via prototype
    public add!: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    public subtract!: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    public multiply!: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    public double!: (key: string, options?: methodOptions) => number | Promise<number>;
    public math!: (key: string, mathSign: MathSigns, value: number, options?: methodOptions) => number | Promise<number>;

    // Collection Methods - imported via prototype
    public startsWith!: (key: string, options?: methodOptions) => any | Promise<any>;
    public endsWith!: (key: string, options?: methodOptions) => any | Promise<any>;
    public includes!: (key: string, options?: methodOptions) => any | Promise<any>;
    public keys!: () => string[] | Promise<string[]>;
    public values!: () => any[] | Promise<any[]>;
    public all!: (type?: 'object' | 'array') => any | Promise<any>;
    public clear!: () => boolean | Promise<boolean>;
    public type!: (key: string, options?: methodOptions) => string | Promise<string>;
    public size!: (key: string, options?: methodOptions) => number | Promise<number>;
    public has!: (key: string, options?: methodOptions) => boolean | Promise<boolean>;
    public table!: (name: string) => GoodDB | Promise<GoodDB>;

    // Async Methods
    public async connect(): Promise<boolean> {
        if (checkDriverIsAsync(this.driver)) {
            return await this.driver.init(this.tableName) as boolean;
        }
        throw new DatabaseError('This driver does not support the connect method');
    }

    public async disconnect(): Promise<boolean> {
        if (checkDriverIsAsync(this.driver)) {
            return (this.driver as MongoDBDriver | MySQLDriver | PostgreSQLDriver).close!();
        }
        throw new DatabaseError('This driver does not support the disconnect method');
    }
}

// Import and apply methods via prototype
import {
    set, get, deleteKey, setMany, getMany, deleteMany,
    push, shift, unshift, pop, pull, find, filter, findAndUpdate, findAndUpdateMany, distinct,
    add, subtract, multiply, double, math,
    startsWith, endsWith, includes, keys, values, all, clear, type, size, has, table
} from './Methods';

// Apply Database Methods
GoodDB.prototype.set = set;
GoodDB.prototype.get = get;
GoodDB.prototype.delete = deleteKey;
GoodDB.prototype.setMany = setMany;
GoodDB.prototype.getMany = getMany;
GoodDB.prototype.deleteMany = deleteMany;

// Apply Array Methods
GoodDB.prototype.push = push;
GoodDB.prototype.shift = shift;
GoodDB.prototype.unshift = unshift;
GoodDB.prototype.pop = pop;
GoodDB.prototype.pull = pull;
GoodDB.prototype.find = find;
GoodDB.prototype.filter = filter;
GoodDB.prototype.findAndUpdate = findAndUpdate;
GoodDB.prototype.findAndUpdateMany = findAndUpdateMany;
GoodDB.prototype.distinct = distinct;

// Apply Math Methods
GoodDB.prototype.add = add;
GoodDB.prototype.subtract = subtract;
GoodDB.prototype.multiply = multiply;
GoodDB.prototype.double = double;
GoodDB.prototype.math = math;

// Apply Collection Methods
GoodDB.prototype.startsWith = startsWith;
GoodDB.prototype.endsWith = endsWith;
GoodDB.prototype.includes = includes;
GoodDB.prototype.keys = keys;
GoodDB.prototype.values = values;
GoodDB.prototype.all = all;
GoodDB.prototype.clear = clear;
GoodDB.prototype.type = type;
GoodDB.prototype.size = size;
GoodDB.prototype.has = has;
GoodDB.prototype.table = table;

export { GoodDB };
