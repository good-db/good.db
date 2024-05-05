export declare class LRUCache {
    private capacity;
    readonly cache: Map<string, any>;
    constructor(capacity: number);
    get(key: string): any;
    put(key: string, value: any): any;
    delete(key: string): boolean;
}
