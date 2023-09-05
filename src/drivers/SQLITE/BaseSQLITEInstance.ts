import sqlite3 from 'better-sqlite3';

export default class BaseSQLITEInstance {
    public readonly instance: BaseSQLITEInstance | null | any;
    public readonly _database: sqlite3.Database | undefined | null | any;

    get database(): sqlite3.Database {
        return this._database;
    }

    constructor(path: string) {
        if (!this.instance) {
            this._database = sqlite3(path);
        }
        return this.instance;
    }

    async prepare(table: string): Promise<void> {
        await this._database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
    }

    async getAllRows(table: string): Promise<{ id: string; value: any }[]> {
        const prep = this._database.prepare(`SELECT * FROM ${table}`);
        const data: { id: string; value: any }[] = [];
        for (const row of prep.iterate()) {
            const parsedRow = row as { ID: string; json: string };
            data.push({
                id: parsedRow.ID,
                value: JSON.parse(parsedRow.json),
            });
        }
        return data;
    }

    async getRowByKey(table: string, key: string): Promise<[any | null, boolean]> {
        const value: any = await this._database
            .prepare(`SELECT * FROM ${table} WHERE ID = (?)`)
            .get(key);
        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }

    async setRowByKey(table: string, key: string, value: any, update: boolean = false): Promise<any> {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            await this._database
                .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                .run(stringifiedJson, key);
        } else {
            await this._database
                .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                .run(key, stringifiedJson);
        }
        return value;
    }

    async deleteAllRows(table: string): Promise<number> {
        const result = await this._database
            .prepare(`DELETE FROM ${table}`)
            .run();
        return result.changes;
    }

    async deleteRowByKey(table: string, key: string): Promise<number> {
        const result = await this._database
            .prepare(`DELETE FROM ${table} WHERE ID = ?`)
            .run(key);
        return result.changes;
    }
}