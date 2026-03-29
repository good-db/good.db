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
exports.GoodDB = void 0;
const SQLite_1 = require("./Drivers/SQLite");
const ErrorMessage_1 = require("./utils/ErrorMessage");
const Caching_1 = require("./utils/Caching");
const Utils_1 = require("./utils/Utils");
/**
 * The main class for the GoodDB package
 * @example Using JSONDriver (sync)
 * ```javascript
 * const db = new GoodDB(new JSONDriver({ path: './database.json' }));
 * ```
 * @example Using MongoDBDriver (async)
 * ```javascript
 * const db = new GoodDB(new MongoDBDriver({ uri: "..." }));
 * await db.connect();
 * ```
 */
class GoodDB {
    constructor(driver, options) {
        var _a, _b, _c, _d;
        this.driver = driver || new SQLite_1.SQLiteDriver({ path: './database.sqlite' });
        this.options = options;
        this.nested = {
            nested: (options === null || options === void 0 ? void 0 : options.nested) || '..',
            isEnabled: (options === null || options === void 0 ? void 0 : options.nestedIsEnabled) ? true : false,
        };
        this.tableName = (options === null || options === void 0 ? void 0 : options.table) || 'gooddb';
        this.isAsync = (0, Utils_1.checkDriverIsAsync)(this.driver);
        if (!this.isAsync) {
            this.driver.init(this.tableName);
        }
        this.cacheIsEnabled = (_b = (_a = options === null || options === void 0 ? void 0 : options.cache) === null || _a === void 0 ? void 0 : _a.isEnabled) !== null && _b !== void 0 ? _b : false;
        this.cacheService = this.cacheIsEnabled ? new Caching_1.LRUCache((_d = (_c = options === null || options === void 0 ? void 0 : options.cache) === null || _c === void 0 ? void 0 : _c.capacity) !== null && _d !== void 0 ? _d : 1024) : undefined;
    }
    get getNestedOptions() {
        var _a, _b;
        return {
            nested: (_a = this.nested.nested) !== null && _a !== void 0 ? _a : '..',
            nestedIsEnabled: (_b = this.nested.isEnabled) !== null && _b !== void 0 ? _b : false,
        };
    }
    checkKey(key) {
        if (!key || typeof key !== 'string' || !(key === null || key === void 0 ? void 0 : key.trim())) {
            throw new ErrorMessage_1.DatabaseError(`GoodDB requires keys to be a string. Provided: ${(key === null || key === void 0 ? void 0 : key.trim()) ? typeof key : 'Null'}`);
        }
    }
    // Async Methods
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, Utils_1.checkDriverIsAsync)(this.driver)) {
                return yield this.driver.init(this.tableName);
            }
            throw new ErrorMessage_1.DatabaseError('This driver does not support the connect method');
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, Utils_1.checkDriverIsAsync)(this.driver)) {
                return this.driver.close();
            }
            throw new ErrorMessage_1.DatabaseError('This driver does not support the disconnect method');
        });
    }
}
exports.default = GoodDB;
exports.GoodDB = GoodDB;
// Import and apply methods via prototype
const Methods_1 = require("./Methods");
// Apply Database Methods
GoodDB.prototype.set = Methods_1.set;
GoodDB.prototype.get = Methods_1.get;
GoodDB.prototype.delete = Methods_1.deleteKey;
GoodDB.prototype.setMany = Methods_1.setMany;
GoodDB.prototype.getMany = Methods_1.getMany;
GoodDB.prototype.deleteMany = Methods_1.deleteMany;
// Apply Array Methods
GoodDB.prototype.push = Methods_1.push;
GoodDB.prototype.shift = Methods_1.shift;
GoodDB.prototype.unshift = Methods_1.unshift;
GoodDB.prototype.pop = Methods_1.pop;
GoodDB.prototype.pull = Methods_1.pull;
GoodDB.prototype.find = Methods_1.find;
GoodDB.prototype.filter = Methods_1.filter;
GoodDB.prototype.findAndUpdate = Methods_1.findAndUpdate;
GoodDB.prototype.findAndUpdateMany = Methods_1.findAndUpdateMany;
GoodDB.prototype.distinct = Methods_1.distinct;
// Apply Math Methods
GoodDB.prototype.add = Methods_1.add;
GoodDB.prototype.subtract = Methods_1.subtract;
GoodDB.prototype.multiply = Methods_1.multiply;
GoodDB.prototype.double = Methods_1.double;
GoodDB.prototype.math = Methods_1.math;
// Apply Collection Methods
GoodDB.prototype.startsWith = Methods_1.startsWith;
GoodDB.prototype.endsWith = Methods_1.endsWith;
GoodDB.prototype.includes = Methods_1.includes;
GoodDB.prototype.keys = Methods_1.keys;
GoodDB.prototype.values = Methods_1.values;
GoodDB.prototype.all = Methods_1.all;
GoodDB.prototype.clear = Methods_1.clear;
GoodDB.prototype.type = Methods_1.type;
GoodDB.prototype.size = Methods_1.size;
GoodDB.prototype.has = Methods_1.has;
GoodDB.prototype.table = Methods_1.table;
//# sourceMappingURL=good.db.js.map