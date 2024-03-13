import { JSONDriverOptions } from '../Types';
import fs from 'fs';

export class JSONDriver {
    public path: string;

    constructor(
        options?: JSONDriverOptions
    ) {
        this.path = options?.path || './db.json';
        this.init();
    };

    private checkFile(): boolean {
        if (!fs.existsSync(this.path)) {
            return false;
        }
        return true;
    }

    public init(): void {
        if (!this.checkFile()) {
            fs.writeFileSync(this.path, JSON.stringify({}));
        };
    };

    public read(): any {
        return JSON.parse(fs.readFileSync(this.path).toString());
    };

    public write(data: any): boolean {
        fs.writeFileSync(this.path, JSON.stringify(data));
        return true;
    };
    
    public clear(): boolean {
        this.write({});
        return true;
    };
};