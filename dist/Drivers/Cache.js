"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDriver = void 0;
class CacheDriver {
    constructor() {
        this.cache = new Map();
    }
    init(table) {
        this.cache.set(table, new Map());
        return true;
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
        return this.getOrCreateTable(table).get(key);
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
    // OLD
    read() {
        return Object.fromEntries(this.cache);
    }
    ;
    write(data) {
        this.cache = new Map(Object.entries(data));
        return true;
    }
    ;
    clear() {
        this.cache.clear();
        return true;
    }
    ;
}
exports.CacheDriver = CacheDriver;
;
//# sourceMappingURL=Cache.js.map