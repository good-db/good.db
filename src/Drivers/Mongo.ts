import { MongoClient, Db } from 'mongodb';
import { MongoDBDriverOptions } from '../Types';

export class MongoDBDriver {
    private client: MongoClient;
    private db: Db | undefined;

    constructor(private options: MongoDBDriverOptions) {
        this.client = new MongoClient(options.uri);
    }

    public async init(): Promise<boolean> {
        if (this.db) return true;
        await this.client.connect();
        this.db = this.client.db(this.options.database);
        return true;
    }

    public async write(data: any): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection('json').updateOne(
            { key: 'json' },
            { $set: { data } },
            { upsert: true }
        );
        return true;
    }

    public async read(): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        const documents = await this.db.collection('json').findOne({
            key: 'json'
        });
        return documents?.data || {};
    };

    public async clear(): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.collection('json').deleteMany({});
        return true;
    }
}