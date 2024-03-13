export declare class CacheDriver {
    private cache;
    constructor();
    init(): boolean;
    read(): any;
    write(data: any): boolean;
    clear(): boolean;
}
