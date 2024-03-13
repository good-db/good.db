"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBDriver = void 0;
const mongodb_1 = require("mongodb");
class MongoDBDriver {
    options;
    client;
    db;
    constructor(options) {
        this.options = options;
        this.client = new mongodb_1.MongoClient(options.uri);
    }
    async init() {
        if (this.db)
            return true;
        await this.client.connect();
        this.db = this.client.db(this.options.database);
        return true;
    }
    async write(data) {
        if (!this.db)
            throw new Error('Database not initialized');
        await this.db.collection('json').updateOne({ key: 'json' }, { $set: { data } }, { upsert: true });
        return true;
    }
    async read() {
        if (!this.db)
            throw new Error('Database not initialized');
        const documents = await this.db.collection('json').findOne({
            key: 'json'
        });
        return documents?.data || {};
    }
    ;
    async clear() {
        if (!this.db)
            throw new Error('Database not initialized');
        await this.db.collection('json').deleteMany({});
        return true;
    }
}
exports.MongoDBDriver = MongoDBDriver;
//# sourceMappingURL=Mongo.js.map