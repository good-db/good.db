import { DriversClassType } from "../Types";

export class MemoryDriver implements DriversClassType {
    public readonly cache: Map<string, any>;

    constructor() {
        this.cache = new Map<string, any>();
    }

    public init(table: string): void {
        this.cache.set(table, new Map());
    };

    public createTable(table: string): boolean {
        if (this.cache.has(table)) return false;
        this.cache.set(table, new Map());
        return true;
    };

    public tables(): string[] {
        return Array.from(this.cache.keys());
    };

    public getOrCreateTable(name: string): Map<string, any> {
        const table = this.cache.get(name);
        if (table) return table;

        const newTable = new Map();
        this.cache.set(name, newTable);
        return newTable;
    };

    // Inserters/Updaters
    public insert(table: string, array: any[]): boolean {
        const tableData = this.getOrCreateTable(table);
        for (const { key, value } of array) {
            tableData.set(key, value);
        };
        return true;
    };

    public setRowByKey(table: string, key: string, value: any): boolean {
        const tableData = this.getOrCreateTable(table);
        tableData.set(key, value);
        return true;
    };

    // Getters
    public getAllRows(table: string): any {
        return Object.fromEntries(this.getOrCreateTable(table));
    };

    public getRowByKey(table: string, key: string): any {
        return this.getOrCreateTable(table).get(key) ?? undefined;
    };

    // Deleters
    public deleteRowByKey(table: string, key: string): number {
        return this.getOrCreateTable(table).delete(key) ? 1 : 0;
    };

    public deleteAllRows(table: string): boolean {
        this.cache.delete(table);
        return true;
    };

    
};