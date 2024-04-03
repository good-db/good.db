import { PoolConfig } from 'pg';
export declare class PostgreSQLDriver {
    readonly options: PoolConfig;
    private pool;
    constructor(options: PoolConfig);
    init(table: string): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<any>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number | null>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
