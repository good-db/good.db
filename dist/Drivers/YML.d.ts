import { JSONDriverOptions } from '../Types';
export declare class YMLDriver {
    path: string;
    constructor(options?: JSONDriverOptions);
    private checkFile;
    init(): void;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
