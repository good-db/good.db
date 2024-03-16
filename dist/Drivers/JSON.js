"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDriver = void 0;
const fs_1 = __importDefault(require("fs"));
class JSONDriver {
    constructor(options) {
        this.options = options;
        this.path = (options === null || options === void 0 ? void 0 : options.path) || './db.json';
        this.format = (options === null || options === void 0 ? void 0 : options.format) || false;
    }
    ;
    checkFile() {
        if (!fs_1.default.existsSync(this.path)) {
            return false;
        }
        return true;
    }
    init(table) {
        if (!this.checkFile()) {
            fs_1.default.writeFileSync(this.path, JSON.stringify({}));
        }
        ;
        if (!this.read()[table]) {
            this.write(Object.assign(Object.assign({}, this.read()), { [table]: {} }));
        }
        ;
    }
    ;
    // Inserters/Updaters
    setRowByKey(table, key, value) {
        const data = this.read();
        const tableData = data[table] || {};
        tableData[key] = value;
        data[table] = tableData;
        this.write(data);
        return true;
    }
    ;
    // Getters
    getAllRows(table) {
        return this.read()[table];
    }
    ;
    getRowByKey(table, key) {
        return this.read()[table][key];
    }
    ;
    // Deleters
    deleteRowByKey(table, key) {
        const data = this.read();
        delete data[table][key];
        this.write(data);
        return 1;
    }
    ;
    deleteAllRows(table) {
        const data = this.read();
        delete data[table];
        this.write(data);
        return true;
    }
    ;
    // OLD
    read() {
        return JSON.parse(fs_1.default.readFileSync(this.path).toString());
    }
    ;
    write(data) {
        if (this.format) {
            fs_1.default.writeFileSync(this.path, JSON.stringify(data, null, 2));
            return true;
        }
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