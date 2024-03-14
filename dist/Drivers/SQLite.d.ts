import { JSONDriverOptions } from '../Types';
export declare class SQLiteDriver {
    readonly options?: JSONDriverOptions | undefined;
    readonly path: string;
    private db;
    constructor(options?: JSONDriverOptions | undefined);
    init(): void;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
