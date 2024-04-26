export declare class MemoryDriver {
    private cache;
    constructor();
    init(table: string): boolean;
    getOrCreateTable(name: string): Map<string, any>;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): any;
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
