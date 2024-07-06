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
exports.MySQLDriver = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class MySQLDriver {
    constructor(options) {
        this.options = options;
        this.pool = promise_1.default.createPool(options);
    }
    init(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                yield connection.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (\`key\` VARCHAR(255) PRIMARY KEY, \`value\` TEXT)`);
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    createTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                yield connection.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (\`key\` VARCHAR(255) PRIMARY KEY, \`value\` TEXT)`);
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    tables() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const [rows] = yield connection.query('SHOW TABLES');
                return rows.map((row) => row[`Tables_in_${this.options.database}`]);
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    // Inserters/Updaters
    insert(table, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const values = value.map(({ key, value }) => `('${key}', '${JSON.stringify(value)}')`).join(', ');
                yield connection.query(`INSERT INTO \`${table}\` (\`key\`, \`value\`) VALUES ${values} ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`);
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    setRowByKey(table, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const valueString = JSON.stringify(value);
                yield connection.query(`INSERT INTO \`${table}\` (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?`, [key, valueString, valueString]);
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    // Getters
    getAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const [rows] = yield connection.query(`SELECT \`key\`, \`value\` FROM \`${table}\``);
                return [rows, false];
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    ;
    getRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const [rows] = yield connection.query(`SELECT \`value\` FROM \`${table}\` WHERE \`key\` = ?`, [key]);
                if (rows.length === 0)
                    return undefined;
                return JSON.parse(rows[0].value);
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    // Deleters
    deleteRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const [{ affectedRows }] = yield connection.query(`DELETE FROM \`${table}\` WHERE \`key\` = ?`, [key]);
                return affectedRows;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
            }
        });
    }
    deleteAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                yield connection.query(`TRUNCATE TABLE \`${table}\``);
                return true;
            }
            catch (error) {
                throw new Error(error);
            }
            finally {
                connection.release();
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
exports.MySQLDriver = MySQLDriver;
;
//# sourceMappingURL=MySQL.js.map