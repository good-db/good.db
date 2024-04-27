import { MongoDBDriverOptions } from '../Types';
export declare class MongoDBDriver {
    readonly options: MongoDBDriverOptions;
    private client;
    private db;
    constructor(options: MongoDBDriverOptions);
    init(table: string): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<any>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
