import { PoolOptions } from 'mysql2/promise';
export declare class MySQLDriver {
    readonly options: PoolOptions;
    private pool;
    constructor(options: PoolOptions);
    init(table: string): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<any>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number | null>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
