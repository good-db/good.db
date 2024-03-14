import { JSONDriverOptions } from '../Types';
import fs from 'fs';
import Database, { Database as DataBaseType } from 'better-sqlite3';

export class SQLiteDriver {
    public readonly path: string;
    private db: DataBaseType;

    constructor(public readonly options?: JSONDriverOptions) {
        this.path = options?.path || './db.sqlite';
        this.db = new Database(this.path);
    }

    public init(): void {
        this.db.exec('CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT)');
    }

    public read(): any {
        const rows: any = this.db.prepare('SELECT * FROM data').all();
        const data: any = {};
        for (const row of rows) {
            data[row.key] = JSON.parse(row.value);
        }
        return data;
    }

    public write(data: any): boolean {
        const insert = this.db.prepare('INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)');
        this.db.transaction((data: any) => {
            for (const key of Object.keys(data)) {
                insert.run(key, JSON.stringify(data[key]));
            }
        })(data);
        return true;
    }

    public clear(): boolean {
        this.db.exec('DELETE FROM data');
        return true;
    }
}