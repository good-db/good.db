import { MongoClient, Db } from 'mongodb';
import { MongoDBDriverOptions } from '../Types';

export class MongoDBDriver {
    private client: MongoClient;
    private db: Db | undefined;

    constructor(public readonly options: MongoDBDriverOptions) {
        this.client = new MongoClient(options.uri);
    }

    public async init(table: string): Promise<boolean> {
        if (this.db) return true;
        await this.client.connect();
        this.db = this.client.db(this.options.database || 'gooddb');
        await this.db.createCollection(table);
        return true;
    };

    // Inserters/Updaters
    public async setRowByKey(table: string, key: string, value: any): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection(table).updateOne({ key }, { $set: { value: JSON.stringify(value) } }, { upsert: true });
        return true;
    };

    // Getters
    public async getAllRows(table: string): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        const cursor = await this.db.collection(table).find();
        const data: any = {};
        await cursor.forEach((doc: any) => {
            data[doc.key] = JSON.parse(doc.value);
        });
        return data;
    };

    public async getRowByKey(table: string, key: string): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        const doc = await this.db.collection(table).findOne({ key });
        
        if (!doc) return doc;
        return JSON.parse(doc.value);
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
        this.db = undefined;
        return true;
    };
    
    // OLD

    public async read(): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        const cursor = await this.db.collection('data').find();
        const data: any = {};
        await cursor.forEach((doc: any) => {
            data[doc.key] = JSON.parse(doc.value);
        });
        return data;
    }

    public async write(data: any): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        const collection = this.db.collection('data');
        
        for (const key of Object.keys(data)) {
            await collection.updateOne({ key }, { $set: { value: JSON.stringify(data[key]) } }, { upsert: true });
        }
        return true;
    }

    public async clear(): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection('data').deleteMany({});
        return true;
    }
}