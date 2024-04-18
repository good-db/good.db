import { RedisOptions } from 'ioredis';
export declare class RedisDriver {
    readonly options: RedisOptions;
    private client;
    private isConnect;
    constructor(options: RedisOptions);
    init(): Promise<boolean>;
    setRowByKey(key: string, value: any): Promise<boolean>;
    getAllRows(): Promise<any>;
    getRowByKey(key: string): Promise<any>;
    deleteRowByKey(key: string): Promise<boolean>;
    deleteAllRows(): Promise<boolean>;
    close(): Promise<boolean>;
}
