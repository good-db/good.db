import fs from 'fs';
import yaml from 'js-yaml';
import { JSONDriverOptions } from '../Types';

export class YMLDriver {
    public readonly path: string;

    constructor(
        public readonly options?: JSONDriverOptions
    ) {
        this.path = options?.path || './db.yml';
        this.init();
    };

    private checkFile(): boolean {
        return fs.existsSync(this.path);
    }

    public init(): void {
        if (!this.checkFile()) {
            fs.writeFileSync(this.path, '');
        }
    };

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