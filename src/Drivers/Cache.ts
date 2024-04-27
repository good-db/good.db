export class MemoryDriver {
    private cache: Map<string, any>;

    constructor() {
        this.cache = new Map<string, any>();
    }

    public init(table: string): boolean {
        this.cache.set(table, new Map());
        return true
    };

    public getOrCreateTable(name: string): Map<string, any> {
        const table = this.cache.get(name);
        if (table) return table;

        const newTable = new Map();
        this.cache.set(name, newTable);
        return newTable;
    };

    // Inserters/Updaters
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
        return this.getOrCreateTable(table).get(key);
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