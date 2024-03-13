"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDriver = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class SQLiteDriver {
    path;
    db;
    constructor(options) {
        this.path = options?.path || './db.sqlite';
        this.db = new better_sqlite3_1.default(this.path);
    }
    init() {
        this.db.exec('CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT)');
    }
    read() {
        const rows = this.db.prepare('SELECT * FROM data').all();
        const data = {};
        for (const row of rows) {
            data[row.key] = JSON.parse(row.value);
        }
        return data;
    }
    write(data) {
        const insert = this.db.prepare('INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)');
        this.db.transaction((data) => {
            for (const key of Object.keys(data)) {
                insert.run(key, JSON.stringify(data[key]));
            }
        })(data);
        return true;
    }
    clear() {
        this.db.exec('DELETE FROM data');
        return true;
    }
}
exports.SQLiteDriver = SQLiteDriver;
//# sourceMappingURL=SQLite.js.map