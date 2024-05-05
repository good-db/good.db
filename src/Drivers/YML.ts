import fs from 'node:fs';
import yaml from 'js-yaml';
import { YMLDriverOptions } from '../Types';

export class YMLDriver {
    public readonly path: string;

    constructor(
        public readonly options?: YMLDriverOptions
    ) {
        this.path = options?.path || './db.yml';
    };

    private checkFile(): boolean {
        return fs.existsSync(this.path);
    }

    public init(table: string): void {
        if (!this.checkFile()) {
            fs.writeFileSync(this.path, '');
        };

        if (!this.read()[table]) {
            this.write({ ...this.read(), [table]: {} });
        };
    };

    // Inserters/Updaters
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
        return this.read()[table];
    };

    public getRowByKey(table: string, key: string): any {
        return this.read()[table][key];
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
        const fileContent = fs.readFileSync(this.path, 'utf8');
        return yaml.load(fileContent) || {};
    };

    public write(data: any): boolean {
        const yamlString = yaml.dump(data);
        fs.writeFileSync(this.path, yamlString);
        return true;
    };

    public clear(): boolean {
        this.write({});
        return true;
    };
};