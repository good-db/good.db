import { DriversClassType, SQLiteDriverOptions } from '../Types';
import Database, { Database as DataBaseType } from 'better-sqlite3';

export class SQLiteDriver implements DriversClassType {
    public readonly path: string;
    public readonly db: DataBaseType;

    constructor(public readonly options?: SQLiteDriverOptions) {
        this.path = options?.path || './db.sqlite';
        this.db = new Database(this.path);
    }

    public init(table: string): void {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
    };

    public createTable(table: string): boolean {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
        return true;
    };

    public tables(): string[] {
        const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        return tables.map((table: any) => table.name);
    };

    // Inserters/Updaters
    public insert(table: string, array: any[]): boolean {
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value TEXT)`);
        const insert = this.db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES (?, ?)`);
        for (const { key, value } of array) {
            insert.run(key, JSON.stringify(value));
        };
        return true;
    };

    public setRowByKey(table: string, key: string, value: any): boolean {
        const insert = this.db.prepare(`INSERT OR REPLACE INTO ${table} (key, value) VALUES (?, ?)`);
        insert.run(key, JSON.stringify(value));
        return true;
    };

    // Getters
    public getAllRows(table: string): [any, boolean] {
        const rows: any = this.db.prepare(`SELECT * FROM ${table}`).all();

        return [rows, false];
    };

    public getRowByKey(table: string, key: string): any {
        const row: any = this.db.prepare(`SELECT * FROM ${table} WHERE key = ?`).get(key);
        if (!row) return undefined;
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
}