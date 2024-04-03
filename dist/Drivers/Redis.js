"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDriver = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisDriver {
    constructor(options) {
        this.options = options;
        this.isConnect = false;
        this.client = new ioredis_1.default(options);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    // Inserters/Updaters
    setRowByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value);
            return true;
        });
    }
    // Getters
    getAllRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.keys('*');
            return data;
        });
    }
    getRowByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.client.get(key);
            return value ? value : null;
        });
    }
    // Deleters
    deleteRowByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.del(key);
            return true;
        });
    }
    deleteAllRows() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.flushall();
            return true;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.disconnect();
            return true;
        });
    }
}
exports.RedisDriver = RedisDriver;
//# sourceMappingURL=Redis.js.map