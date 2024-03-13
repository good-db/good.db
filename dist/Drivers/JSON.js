"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDriver = void 0;
const fs_1 = __importDefault(require("fs"));
class JSONDriver {
    path;
    constructor(options) {
        this.path = options?.path || './db.json';
        this.init();
    }
    ;
    checkFile() {
        if (!fs_1.default.existsSync(this.path)) {
            return false;
        }
        return true;
    }
    init() {
        if (!this.checkFile()) {
            fs_1.default.writeFileSync(this.path, JSON.stringify({}));
        }
        ;
    }
    ;
    read() {
        return JSON.parse(fs_1.default.readFileSync(this.path).toString());
    }
    ;
    write(data) {
        fs_1.default.writeFileSync(this.path, JSON.stringify(data));
        return true;
    }
    ;
    clear() {
        this.write({});
        return true;
    }
    ;
}
exports.JSONDriver = JSONDriver;
;
//# sourceMappingURL=JSON.js.map