"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convertor = exports.MySQLDriver = exports.PostgreSQLDriver = exports.MongoDBDriver = exports.YMLDriver = exports.MemoryDriver = exports.CacheDriver = exports.SQLiteDriver = exports.JSONDriver = exports.GoodDB = void 0;
const good_db_1 = __importDefault(require("./good.db"));
const Convertor_1 = __importDefault(require("./Convertor"));
const JSON_1 = require("./Drivers/JSON");
const SQLite_1 = require("./Drivers/SQLite");
const Cache_1 = require("./Drivers/Cache");
const YML_1 = require("./Drivers/YML");
const Mongo_1 = require("./Drivers/Mongo");
const PostgreSQL_1 = require("./Drivers/PostgreSQL");
const MySQL_1 = require("./Drivers/MySQL");
/**
 * The main class for the GoodDB package
 * @example
 * ## Using the JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new new JSONDriver({
 *         path: './database.json'
 *   }));
 * ```
 * ## Using the MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 *       uri: "..."
 * }));
 * await db.connect();
 * ```
 */
exports.GoodDB = good_db_1.default;
/**
 * The JSONDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 *        path: './database.json'
 * }));
 * ```
 * @example
 * ```javascript
 * const db = new GoodDB(new JSONDriver({
 *       path: './database.json',
 *      format: true
 * }));
 * ```
 */
exports.JSONDriver = JSON_1.JSONDriver;
/**
 * The SQLiteDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new SQLiteDriver({
 *        path: './database.db'
 * }));
 * ```
 */
exports.SQLiteDriver = SQLite_1.SQLiteDriver;
/**
 * The CacheDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new CacheDriver());
 * ```
 */
class CacheDriver extends Cache_1.MemoryDriver {
    constructor() {
        super();
        console.log("\x1b[33m[Warning:good.db]: CacheDriver name will be deprecated in the future, please use MemoryDriver instead.\x1b[0m");
    }
}
exports.CacheDriver = CacheDriver;
exports.MemoryDriver = Cache_1.MemoryDriver;
/**
 * The YMLDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new YMLDriver({
 *        path: './database.yml'
 * }));
 * ```
 */
exports.YMLDriver = YML_1.YMLDriver;
/**
 * The MongoDBDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 *        uri: 'mongodb://localhost:27017'
 * }));
 * ```
 */
exports.MongoDBDriver = Mongo_1.MongoDBDriver;
/**
 * The PostgreSQLDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new PostgreSQLDriver({
 *     user: "gooddb",
 *     password: "password",
 *     host: "host",
 *     port: 23070,
 *     database: "defaultdb"
 * }));
 */
exports.PostgreSQLDriver = PostgreSQL_1.PostgreSQLDriver;
/**
 * The MySQLDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new MySQLDriver({
 *   charset: 'utf8mb4',
 *   connectTimeout: 10,
 *   database: 'defaultdb',
 *   host: 'host',
 *   password: 'password',
 *   port: 23070,
 *   user: 'gooddb',
 *   namedPlaceholders: true,
 * }));
 * ```
 */
exports.MySQLDriver = MySQL_1.MySQLDriver;
/**
 * The Convertor class for the GoodDB package
 * @example
 * ```javascript
 * const convertor = new Convertor({
 *     from: new JSONDriver(),
 *     to: new MongoDBDriver(),
 *     table: 'all_tables',
 * });
 * ```
 */
exports.Convertor = Convertor_1.default;
//# sourceMappingURL=index.js.map