import { MongoClient, Db } from 'mongodb';
import { MongoDBDriverOptions } from '../Types';

export class MongoDBDriver {
    private client: MongoClient;
    private db: Db | undefined;

    constructor(public readonly options: MongoDBDriverOptions) {
        this.client = new MongoClient(options.uri);
    }

    public async init(): Promise<boolean> {
        if (this.db) return true;
        await this.client.connect();
        this.db = this.client.db(this.options.database || 'gooddb');
        return true;
    };

    public async close(): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.client.close();
        this.db = undefined;
        return true;
    };

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