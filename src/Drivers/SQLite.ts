import { JSONDriverOptions } from '../Types';
import Database, { Database as DataBaseType } from 'better-sqlite3';

export class SQLiteDriver {
    public readonly path: string;
    private db: DataBaseType;

    constructor(public readonly options?: JSONDriverOptions) {
        this.path = options?.path || './db.sqlite';
        this.db = new Database(this.path);
    }

    public init(table: string): void {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
    };

    // Inserters/Updaters
    public setRowByKey(table: string, key: string, value: any): boolean {
        const insert = this.db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES (?, ?)`);
        insert.run(key, JSON.stringify(value));
        return true;
    };

    // Getters
    public getAllRows(table: string): any {
        const rows: any = this.db.prepare(`SELECT * FROM ${table}`).all();
        const data: any = {};
        for (const row of rows) {
            data[row.key] = JSON.parse(row.value);
        }
        return data;
    };

    public getRowByKey(table: string, key: string): any {
        const row: any = this.db.prepare(`SELECT * FROM ${table} WHERE key = ?`).get(key);
        if (!row) return row;
        return JSON.parse(row.value);
    };

    // Deleters
    public deleteRowByKey(table: string, key: string): number {
        return this.db.prepare(`DELETE FROM ${table} WHERE key = ?`).run(key).changes;
    };

    public deleteAllRows(table: string): boolean {
        this.db.exec(`DELETE FROM ${table}`);
        return true;
    };

    // OLD
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
    };

    public clear(): boolean {
        this.db.exec('DELETE FROM data');
        return true;
    }
}