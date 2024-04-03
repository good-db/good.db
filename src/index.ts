import GoodDBMain from "./good.db";
import { JSONDriver as JSONDriverMain } from "./Drivers/JSON";
import { SQLiteDriver as SQLiteDriverMain } from "./Drivers/SQLite";
import { CacheDriver as CacheDriverMain } from "./Drivers/Cache";
import { YMLDriver as YMLDriverMain } from './Drivers/YML';
import { MongoDBDriver as MongoDBDriverMain } from './Drivers/Mongo';
import { PostgreSQLDriver as PostgreSQLDriverMain } from "./Drivers/PostgreSQL";
import { MySQLDriver as MySQLDriverMain } from "./Drivers/MySQL";

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
export const GoodDB = GoodDBMain;

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
export const JSONDriver = JSONDriverMain;

/**
 * The SQLiteDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new SQLiteDriver({
 *        path: './database.db'
 * }));
 * ```
 */
export const SQLiteDriver = SQLiteDriverMain;

/**
 * The CacheDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new CacheDriver());
 * ```
 */
export const CacheDriver = CacheDriverMain;

/**
 * The YMLDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new YMLDriver({
 *        path: './database.yml'
 * }));
 * ```
 */
export const YMLDriver = YMLDriverMain;

/**
 * The MongoDBDriver class for the GoodDB package
 * @example
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({
 *        uri: 'mongodb://localhost:27017'
 * }));
 * ```
 */
export const MongoDBDriver = MongoDBDriverMain;

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
export const PostgreSQLDriver = PostgreSQLDriverMain;

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
export const MySQLDriver = MySQLDriverMain;