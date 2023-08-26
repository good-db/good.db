"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class BaseSQLITEInstance {
    instance;
    _database;
    get database() {
        return this._database;
    }
    constructor(path) {
        if (!this.instance) {
            this._database = (0, better_sqlite3_1.default)(path);
        }
        return this.instance;
    }
    async prepare(table) {
        await this._database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
    }
    async getAllRows(table) {
        const prep = this._database.prepare(`SELECT * FROM ${table}`);
        const data = [];
        for (const row of prep.iterate()) {
            const parsedRow = row;
            data.push({
                id: parsedRow.ID,
                value: JSON.parse(parsedRow.json),
            });
        }
        return data;
    }
    async getRowByKey(table, key) {
        const value = await this._database
            .prepare(`SELECT json FROM ${table} WHERE ID = ?`)
            .get(key);
        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }
    async setRowByKey(table, key, value, update = false) {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            await this._database
                .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                .run(stringifiedJson, key);
        }
        else {
            await this._database
                .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                .run(key, stringifiedJson);
        }
        return value;
    }
    async deleteAllRows(table) {
        const result = await this._database
            .prepare(`DELETE FROM ${table}`)
            .run();
        return result.changes;
    }
    async deleteRowByKey(table, key) {
        const result = await this._database
            .prepare(`DELETE FROM ${table} WHERE ID = ?`)
            .run(key);
        return result.changes;
    }
}
exports.default = BaseSQLITEInstance;
//# sourceMappingURL=BaseSQLITEInstance.js.map