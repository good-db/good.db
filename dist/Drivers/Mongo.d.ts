import { MongoDBDriverOptions } from '../Types';
export declare class MongoDBDriver {
    private options;
    private client;
    private db;
    constructor(options: MongoDBDriverOptions);
    init(): Promise<boolean>;
    write(data: any): Promise<boolean>;
    read(): Promise<any>;
    clear(): Promise<boolean>;
}
