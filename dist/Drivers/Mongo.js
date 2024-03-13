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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db)
                return true;
            yield this.client.connect();
            this.db = this.client.db(this.options.database);
            return true;
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.db.collection('json').updateOne({ key: 'json' }, { $set: { data } }, { upsert: true });
            return true;
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            const documents = yield this.db.collection('json').findOne({
                key: 'json'
            });
            return (documents === null || documents === void 0 ? void 0 : documents.data) || {};
        });
    }
    ;
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db)
                throw new Error('Database not initialized');
            yield this.db.collection('json').deleteMany({});
            return true;
        });
    }
}
exports.MongoDBDriver = MongoDBDriver;
//# sourceMappingURL=Mongo.js.map