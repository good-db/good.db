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
exports.MongoDBDriver = void 0;
const mongodb_1 = require("mongodb");
class MongoDBDriver {
    constructor(options) {
        this.options = options;
        this.client = new mongodb_1.MongoClient(options.uri);
    }
    init(table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db)
                return true;
            yield this.client.connect();
            this.db = this.client.db(this.options.database || 'gooddb');
            yield this.db.createCollection(table);
            return true;
        });
    }
    ;
    // Inserters/Updaters
    setRowByKey(table, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.db.collection(table).updateOne({ key }, { $set: { value: JSON.stringify(value) } }, { upsert: true });
            return true;
        });
    }
    ;
    // Getters
    getAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const cursor = yield this.db.collection(table).find();
            const data = {};
            yield cursor.forEach((doc) => {
                data[doc.key] = JSON.parse(doc.value);
            });
            return data;
        });
    }
    ;
    getRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const doc = yield this.db.collection(table).findOne({ key });
            if (!doc)
                return null;
            return JSON.parse(doc.value);
        });
    }
    ;
    // Deleters
    deleteRowByKey(table, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const result = yield this.db.collection(table).deleteOne({ key });
            return result.deletedCount || 0;
        });
    }
    ;
    deleteAllRows(table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.db.collection(table).deleteMany({});
            return true;
        });
    }
    ;
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.client.close();
            this.db = undefined;
            return true;
        });
    }
    ;
    // OLD
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const cursor = yield this.db.collection('data').find();
            const data = {};
            yield cursor.forEach((doc) => {
                data[doc.key] = JSON.parse(doc.value);
            });
            return data;
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const collection = this.db.collection('data');
            for (const key of Object.keys(data)) {
                yield collection.updateOne({ key }, { $set: { value: JSON.stringify(data[key]) } }, { upsert: true });
            }
            return true;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.db.collection('data').deleteMany({});
            return true;
        });
    }
}
exports.MongoDBDriver = MongoDBDriver;
//# sourceMappingURL=Mongo.js.map