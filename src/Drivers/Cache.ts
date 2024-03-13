export class CacheDriver {
    private cache: Map<string, any>;

    constructor() {
        this.cache = new Map<string, any>();
    }

    public init(): boolean {
        return true
    }

    public read(): any {
        return Object.fromEntries(this.cache);
    }

    public write(data: any): boolean {
        this.cache = new Map(Object.entries(data));
        return true;
    }

    public clear(): boolean {
        this.cache.clear();
        return true;
    }
};