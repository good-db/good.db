import { MongoDBDriverOptions } from '../Types';
export declare class MongoDBDriver {
    readonly options: MongoDBDriverOptions;
    private client;
    private db;
    constructor(options: MongoDBDriverOptions);
    init(): Promise<boolean>;
    close(): Promise<boolean>;
    read(): Promise<any>;
    write(data: any): Promise<boolean>;
    clear(): Promise<boolean>;
}
