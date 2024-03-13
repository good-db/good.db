import { JSONDriverOptions } from '../Types';
export declare class SQLiteDriver {
    path: string;
    private db;
    constructor(options?: JSONDriverOptions);
    init(): void;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
