"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDriver = void 0;
class MemoryDriver {
    constructor() {
        this.cache = new Map();
    }
    init(table) {
        this.cache.set(table, new Map());
    }
    ;
    createTable(table) {
        if (this.cache.has(table))
            return false;
        this.cache.set(table, new Map());
        return true;
    }
    ;
    tables() {
        return Array.from(this.cache.keys());
    }
    ;
    getOrCreateTable(name) {
        const table = this.cache.get(name);
        if (table)
            return table;
        const newTable = new Map();
        this.cache.set(name, newTable);
        return newTable;
    }
    ;
    // Inserters/Updaters
    insert(table, array) {
        const tableData = this.getOrCreateTable(table);
        for (const { key, value } of array) {
            tableData.set(key, value);
        }
        ;
        return true;
    }
    ;
    setRowByKey(table, key, value) {
        const tableData = this.getOrCreateTable(table);
        tableData.set(key, value);
        return true;
    }
    ;
    // Getters
    getAllRows(table) {
        return Object.fromEntries(this.getOrCreateTable(table));
    }
    ;
    getRowByKey(table, key) {
        var _a;
        return (_a = this.getOrCreateTable(table).get(key)) !== null && _a !== void 0 ? _a : undefined;
    }
    ;
    // Deleters
    deleteRowByKey(table, key) {
        return this.getOrCreateTable(table).delete(key) ? 1 : 0;
    }
    ;
    deleteAllRows(table) {
        this.cache.delete(table);
        return true;
    }
    ;
}
exports.MemoryDriver = MemoryDriver;
;
//# sourceMappingURL=Cache.js.map