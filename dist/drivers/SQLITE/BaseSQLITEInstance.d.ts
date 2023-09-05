import sqlite3 from 'better-sqlite3';
export default class BaseSQLITEInstance {
    readonly instance: BaseSQLITEInstance | null | any;
    readonly _database: sqlite3.Database | undefined | null | any;
    get database(): sqlite3.Database;
    constructor(path: string);
    prepare(table: string): Promise<void>;
    getAllRows(table: string): Promise<{
        id: string;
        value: any;
    }[]>;
    getRowByKey(table: string, key: string): Promise<[any | null, boolean]>;
    setRowByKey(table: string, key: string, value: any, update?: boolean): Promise<any>;
    deleteAllRows(table: string): Promise<number>;
    deleteRowByKey(table: string, key: string): Promise<number>;
}
