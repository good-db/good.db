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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQLDriver = void 0;
const pg_1 = require("pg");
// import { PostgreSQLDriverOptions } from '../Types';
class PostgreSQLDriver {
    constructor(options) {
        this.options = options;
        this.pool = new pg_1.Pool(options);
    }
    ;
    init(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                yield client.query(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value JSONB)`);
                return true;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    ;
    // Inserters/Updaters
    setRowByKey(table, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                yield client.query(`INSERT INTO ${table} (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`, [key, JSON.stringify(value)]);
                return true;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Getters
    getAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const { rows } = yield client.query(`SELECT key, value FROM ${table}`);
                const data = {};
                rows.forEach((row) => {
                    data[row.key] = row.value;
                });
                return data;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    getRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const { rows } = yield client.query(`SELECT value FROM ${table} WHERE key = $1`, [key]);
                if (rows.length === 0)
                    return null;
                return rows[0].value;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Deleters
    deleteRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const { rowCount } = yield client.query(`DELETE FROM ${table} WHERE key = $1`, [key]);
                return rowCount;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    deleteAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                yield client.query(`TRUNCATE TABLE ${table}`);
                return true;
            }
            catch (error) {
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
            return true;
        });
    }
}
exports.PostgreSQLDriver = PostgreSQLDriver;
//# sourceMappingURL=PostgreSQL.js.map