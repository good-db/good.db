import { DriversClassType } from "../Types";
export declare class MemoryDriver implements DriversClassType {
    readonly cache: Map<string, any>;
    constructor();
    init(table: string): void;
    createTable(table: string): boolean;
    tables(): string[];
    getOrCreateTable(name: string): Map<string, any>;
    insert(table: string, array: any[]): boolean;
    setRowByKey(table: string, key: string, value: any): boolean;
    getAllRows(table: string): any;
    getRowByKey(table: string, key: string): any;
    deleteRowByKey(table: string, key: string): number;
    deleteAllRows(table: string): boolean;
}
