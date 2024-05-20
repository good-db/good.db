import { DriversClassType, JSONDriverOptions } from '../Types';
export declare class JSONDriver implements DriversClassType {
    readonly options?: JSONDriverOptions | undefined;
    readonly path: string;
    readonly format: boolean;
    constructor(options?: JSONDriverOptions | undefined);
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
    write(data: any): void;
    clear(): void;
}
