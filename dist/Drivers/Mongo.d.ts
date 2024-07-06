import { MongoClient } from 'mongodb';
import { DatabaseDesignArray, DriversClassType, MongoDBDriverOptions } from '../Types';
export declare class MongoDBDriver implements DriversClassType {
    readonly options: MongoDBDriverOptions;
    readonly client: MongoClient;
    private db;
    constructor(options: MongoDBDriverOptions);
    init(table: string): Promise<boolean>;
    createTable(table: string): Promise<boolean>;
    tables(): Promise<string[]>;
    insert(table: string, value: DatabaseDesignArray): Promise<boolean>;
    setRowByKey(table: string, key: string, value: any): Promise<boolean>;
    getAllRows(table: string): Promise<[any, boolean]>;
    getRowByKey(table: string, key: string): Promise<any>;
    deleteRowByKey(table: string, key: string): Promise<number>;
    deleteAllRows(table: string): Promise<boolean>;
    close(): Promise<boolean>;
}
