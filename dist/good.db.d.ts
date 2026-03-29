import { Drivers, goodDBOptions, IGoodDB, MathSigns, methodOptions } from "./Types";
import { LRUCache } from "./utils/Caching";
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
    readonly driver: Drivers;
    readonly tableName: string;
    readonly nested: {
        nested: string;
        isEnabled: boolean;
    };
    readonly cacheIsEnabled: boolean;
    readonly isAsync: boolean;
    cacheService: LRUCache | undefined;
    readonly options?: goodDBOptions;
    constructor(driver?: Drivers, options?: goodDBOptions);
    get getNestedOptions(): {
        nested: string;
        nestedIsEnabled: boolean;
    };
    checkKey(key: string): void;
    set: (key: string, value: any, options?: methodOptions) => boolean | Promise<boolean>;
    get: (key: string, options?: methodOptions) => any | Promise<any>;
    delete: (key: string, options?: methodOptions) => boolean | Promise<boolean>;
    setMany: (data: Record<string, any>, options?: methodOptions) => boolean | Promise<boolean>;
    getMany: (keys: string[], options?: methodOptions) => Record<string, any> | Promise<Record<string, any>>;
    deleteMany: (keys: string[], options?: methodOptions) => boolean | Promise<boolean>;
    push: (key: string, value: any, options?: methodOptions) => number | Promise<number>;
    shift: (key: string, options?: methodOptions) => any | Promise<any>;
    unshift: (key: string, value: any, options?: methodOptions) => number | Promise<number>;
    pop: (key: string, options?: methodOptions) => any | Promise<any>;
    pull: (key: string, valueOrCallback: (e: any, i: number, a: any) => any, pullAll?: boolean, options?: methodOptions) => boolean | Promise<boolean>;
    find: (key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions) => any | Promise<any>;
    filter: (key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions) => any[] | Promise<any[]>;
    findAndUpdate: (key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => any | Promise<any>;
    findAndUpdateMany: (key: string, findCallback: (value: any, index: number, obj: any[]) => unknown, updateCallback: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => any[] | Promise<any[]>;
    distinct: (key: string, value?: (value: any, index: number, obj: any[]) => any, options?: methodOptions) => boolean | Promise<boolean>;
    add: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    subtract: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    multiply: (key: string, value: number, options?: methodOptions) => number | Promise<number>;
    double: (key: string, options?: methodOptions) => number | Promise<number>;
    math: (key: string, mathSign: MathSigns, value: number, options?: methodOptions) => number | Promise<number>;
    startsWith: (key: string, options?: methodOptions) => any | Promise<any>;
    endsWith: (key: string, options?: methodOptions) => any | Promise<any>;
    includes: (key: string, options?: methodOptions) => any | Promise<any>;
    keys: () => string[] | Promise<string[]>;
    values: () => any[] | Promise<any[]>;
    all: (type?: 'object' | 'array') => any | Promise<any>;
    clear: () => boolean | Promise<boolean>;
    type: (key: string, options?: methodOptions) => string | Promise<string>;
    size: (key: string, options?: methodOptions) => number | Promise<number>;
    has: (key: string, options?: methodOptions) => boolean | Promise<boolean>;
    table: (name: string) => GoodDB | Promise<GoodDB>;
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
}
export { GoodDB };
