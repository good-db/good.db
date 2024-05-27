import { PoolConfig } from 'pg';
import { DriversClassType } from '../Types';
export declare class PostgreSQLDriver implements DriversClassType {
    readonly options: PoolConfig;
    private pool;
    constructor(options: PoolConfig);
    init(table: string): Promise<boolean>;
    createTable(table: string): Promise<boolean>;
    tables(): Promise<string[]>;
    insert(table: string, value: any[]): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<any>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number | null>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
