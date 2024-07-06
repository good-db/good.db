import { Pool, PoolOptions } from 'mysql2/promise';
import { DatabaseDesignArray, DriversClassType } from '../Types';
export declare class MySQLDriver implements DriversClassType {
    readonly options: PoolOptions;
    readonly pool: Pool;
    constructor(options: PoolOptions);
    init(table: string): Promise<boolean>;
    createTable(table: string): Promise<boolean>;
    tables(): Promise<string[]>;
    insert(table: string, value: DatabaseDesignArray): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<[any, boolean]>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number | null>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
