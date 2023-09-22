"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class BaseSQLITEInstance {
    get database() {
        return this._database;
    }
    constructor(path) {
        if (!this.instance) {
            this._database = (0, better_sqlite3_1.default)(path);
        }
        return this.instance;
    }
    prepare(table) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
        });
    }
    getAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this._database
                .prepare(`SELECT * FROM ${table} WHERE ID = (?)`)
                .get(key);
            return value != null ? [JSON.parse(value.json), true] : [null, false];
        });
    }
    setRowByKey(table, key, value, update = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringifiedJson = JSON.stringify(value);
            if (update) {
                yield this._database
                    .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                    .run(stringifiedJson, key);
            }
            else {
                yield this._database
                    .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                    .run(key, stringifiedJson);
            }
            return value;
        });
    }
    deleteAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._database
                .prepare(`DELETE FROM ${table}`)
                .run();
            return result.changes;
        });
    }
    deleteRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._database
                .prepare(`DELETE FROM ${table} WHERE ID = ?`)
                .run(key);
            return result.changes;
        });
    }
}
exports.default = BaseSQLITEInstance;
