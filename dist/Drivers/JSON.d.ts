import { JSONDriverOptions } from '../Types';
export declare class JSONDriver {
    path: string;
    constructor(options?: JSONDriverOptions);
    private checkFile;
    init(): void;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
