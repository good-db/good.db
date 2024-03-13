"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDriver = void 0;
class CacheDriver {
    cache;
    constructor() {
        this.cache = new Map();
    }
    init() {
        return true;
    }
    read() {
        return Object.fromEntries(this.cache);
    }
    write(data) {
        this.cache = new Map(Object.entries(data));
        return true;
    }
    clear() {
        this.cache.clear();
        return true;
    }
}
exports.CacheDriver = CacheDriver;
;
//# sourceMappingURL=Cache.js.map