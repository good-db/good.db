import { DriversClassType, SQLiteDriverOptions } from '../Types';
export declare class SQLiteDriver implements DriversClassType {
    readonly options?: SQLiteDriverOptions | undefined;
    readonly path: string;
    private db;
    constructor(options?: SQLiteDriverOptions | undefined);
    init(table: string): void;
    createTable(table: string): boolean;
    tables(): string[];
    insert(table: string, array: any[]): boolean;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): [any, boolean];
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
}
