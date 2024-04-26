import { DatabaseError } from "./ErrorMessage";

export class LRUCache {
    private capacity: number;
    public readonly cache: Map<string, any>;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key: string): any {
        if (typeof key !== 'string') throw new DatabaseError("Key must be a strinng");
        if (!this.cache.has(key)) return undefined;

        // Move the accessed key to the end to mark it as the most recently used
        const value: any = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    put(key: string, value: any): any {
        if (typeof key !== 'string') throw new DatabaseError("Key must be a string");
        if (this.cache.has(key)) {
            // If the key exists, update its value and move it to the end
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // If the cache is full, remove the least recently used item (the first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        // Add the new item to the end
        this.cache.set(key, value);
    }

    delete(key: string): boolean {
        if (typeof key !== 'string') throw new DatabaseError("Key must be a string");
        return this.cache.delete(key);
    }
}
