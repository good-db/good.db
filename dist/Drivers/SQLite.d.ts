import { SQLiteDriverOptions } from '../Types';
export declare class SQLiteDriver {
    readonly options?: SQLiteDriverOptions | undefined;
    readonly path: string;
    private db;
    constructor(options?: SQLiteDriverOptions | undefined);
    init(table: string): void;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): any;
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
}
