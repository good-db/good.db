import { DriversClassType, YMLDriverOptions } from '../Types';
export declare class YMLDriver implements DriversClassType {
    readonly options?: YMLDriverOptions | undefined;
    readonly path: string;
    constructor(options?: YMLDriverOptions | undefined);
    private checkFile;
    init(table: string): void;
    createTable(table: string): boolean;
    tables(): string[];
    insert(table: string, array: any[]): boolean;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): any;
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
