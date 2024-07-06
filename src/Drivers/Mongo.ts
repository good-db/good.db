import { MongoClient, Db } from 'mongodb';
import { DatabaseDesignArray, DriversClassType, MongoDBDriverOptions } from '../Types';

export class MongoDBDriver implements DriversClassType {
    public readonly client: MongoClient;
    private db: Db | null | undefined;

    constructor(public readonly options: MongoDBDriverOptions) {
        this.client = new MongoClient(options.uri);
    }

    public async init(table: string): Promise<boolean> {
        if (this.db) return false;
        await this.client.connect();
        this.db = this.client.db(this.options.database ?? 'gooddb');
        await this.db.createCollection(table);
        return true;
    };

    public async createTable(table: string): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.createCollection(table);
        return true;
    };

    public async tables(): Promise<string[]> {
        if (!this.db) throw new Error('Database not initialized');
        return (await this.db.listCollections().toArray()).map((collection: any) => collection.name);
    };

    // Inserters/Updaters
    public async insert(table: string, value: DatabaseDesignArray): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.collection(table).insertMany(value);
        return true;
    };

    public async setRowByKey(table: string, key: string, value: any): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection(table).updateOne({ key }, { $set: { value: value } }, { upsert: true });
        return true;
    };

    // Getters
    public async getAllRows(table: string): Promise<[any, boolean]> {
        if (!this.db) throw new Error('Database not initialized');
        const cursor = await this.db.collection(table).find().toArray();
        return [cursor, false];
    };

    public async getRowByKey(table: string, key: string): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        const doc = await this.db.collection(table).findOne({ key });
        if (!doc) return undefined;
        return doc.value;
    };

    // Deleters
    public async deleteRowByKey(table: string, key: string): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');
        const result = await this.db.collection(table).deleteOne({ key });
        return result.deletedCount || 0;
    };

    public async deleteAllRows(table: string): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection(table).deleteMany({});
        return true;
    };

    public async close(): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.client.close();
        this.db = null;
        return true;
    };
}