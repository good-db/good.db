import { JSONDriverOptions } from '../Types';
export declare class JSONDriver {
    readonly options?: JSONDriverOptions | undefined;
    readonly path: string;
    constructor(options?: JSONDriverOptions | undefined);
    private checkFile;
    init(): void;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
