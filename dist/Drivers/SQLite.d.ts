import { JSONDriverOptions } from '../Types';
export declare class SQLiteDriver {
    readonly options?: JSONDriverOptions | undefined;
    readonly path: string;
    private db;
    constructor(options?: JSONDriverOptions | undefined);
    init(table: string): void;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): any;
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
