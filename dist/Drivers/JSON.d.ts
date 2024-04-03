import { JSONDriverOptions } from '../Types';
export declare class JSONDriver {
    readonly options?: JSONDriverOptions | undefined;
    readonly path: string;
    readonly format: boolean;
    constructor(options?: JSONDriverOptions | undefined);
    private checkFile;
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
