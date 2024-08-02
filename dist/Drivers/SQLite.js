"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDriver = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SQLiteDriver {
    constructor(options) {
        this.options = options;
        this.path = (options === null || options === void 0 ? void 0 : options.path) || './db.sqlite';
        this.db = new better_sqlite3_1.default(this.path);
    }
    init(table) {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
    }
    ;
    createTable(table) {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
        return true;
    }
    ;
    tables() {
        const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        return tables.map((table) => table.name);
    }
    ;
    // Inserters/Updaters
    insert(table, array) {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
        const insert = this.db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES (?, ?)`);
        for (const { key, value } of array) {
            insert.run(key, JSON.stringify(value));
        }
        ;
        return true;
    }
    ;
    setRowByKey(table, key, value) {
        const insert = this.db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES (?, ?)`);
        insert.run(key, JSON.stringify(value));
        return true;
    }
    ;
    // Getters
    getAllRows(table) {
        const rows = this.db.prepare(`SELECT * FROM ${table}`).all();
        return [rows, false];
    }
    ;
    getRowByKey(table, key) {
        const row = this.db.prepare(`SELECT * FROM ${table} WHERE key = ?`).get(key);
        if (!row)
            return undefined;
        return JSON.parse(row.value);
    }
    ;
    // Deleters
    deleteRowByKey(table, key) {
        return this.db.prepare(`DELETE FROM ${table} WHERE key = ?`).run(key).changes;
    }
    ;
    deleteAllRows(table) {
        this.db.exec(`DELETE FROM ${table}`);
        return true;
    }
    ;
}
exports.SQLiteDriver = SQLiteDriver;
//# sourceMappingURL=SQLite.js.map