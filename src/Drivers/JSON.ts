import { DriversClassType, JSONDriverOptions } from '../Types';
import fs from 'node:fs';

export class JSONDriver implements DriversClassType {
    public readonly path: string;
    public readonly format: boolean;

    constructor(
        public readonly options?: JSONDriverOptions
    ) {
        this.path = options?.path || './db.json';
        this.format = options?.format || false;
    };

    private checkFile(): boolean {
        if (!fs.existsSync(this.path)) {
            return false;
        }
        return true;
    };

    public init(table: string): void {
        if (!this.checkFile()) {
            // Check if directory exists
            for (const dir of this.path.split('/').slice(0, -1)) {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                };
            };
            fs.writeFileSync(this.path, JSON.stringify({}));
        };

        if (!this.read()[table]) {
            this.write({ ...this.read(), [table]: {} });
        };
    };

    public createTable(table: string): boolean {
        if (!this.checkFile()) {
            fs.writeFileSync(this.path, JSON.stringify({}));
        };

        if (!this.read()[table]) {
            this.write({ ...this.read(), [table]: {} });
        };
        return true;
    };

    public tables(): string[] {
        return Object.keys(this.read());
    };

    // Inserters/Updaters
    public insert(table: string, array: any[]): boolean {
        const data = this.read();
        const tableData: any = data[table] || {};
        for (const { key, value } of array) {
            tableData[key] = value;
        };
        data[table] = tableData;
        this.write(data);
        return true;
    };

    public setRowByKey(table: string, key: string, value: any): boolean {
        const data = this.read();
        const tableData: any = data[table] || {};
        tableData[key] = value;
        data[table] = tableData;
        this.write(data);
        return true;
    };

    // Getters
    public getAllRows(table: string): any {
        return [this.read()[table] || {}, true];
    };

    public getRowByKey(table: string, key: string): any {
        return this.read()[table] ? this.read()[table][key] || undefined : undefined;
    };

    // Deleters
    public deleteRowByKey(table: string, key: string): number {
        const data = this.read();
        delete data[table][key];
        this.write(data);
        return 1;
    };

    public deleteAllRows(table: string): boolean {
        const data = this.read();
        delete data[table];
        this.write(data);
        return true;
    };

    // OLD
    public read(): any {
        if (!this.checkFile()) {
            return {};
        }
        return JSON.parse(fs.readFileSync(this.path).toString());
    };

    public write(data: any): void {
        if (this.format) {
            fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
        } else {
            fs.writeFileSync(this.path, JSON.stringify(data));
        }
    };

    public clear(): void {
        this.write({});
    };
    
};