"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDriver = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
class JSONDriver {
    constructor(options) {
        this.options = options;
        this.path = (options === null || options === void 0 ? void 0 : options.path) || './db.json';
        this.format = (options === null || options === void 0 ? void 0 : options.format) || false;
    }
    ;
    checkFile() {
        if (!node_fs_1.default.existsSync(this.path)) {
            return false;
        }
        return true;
    }
    ;
    init(table) {
        if (!this.checkFile()) {
            // Check if directory exists
            for (const dir of this.path.split('/').slice(0, -1)) {
                if (!node_fs_1.default.existsSync(dir)) {
                    node_fs_1.default.mkdirSync(dir);
                }
                ;
            }
            ;
            node_fs_1.default.writeFileSync(this.path, JSON.stringify({}));
        }
        ;
        if (!this.read()[table]) {
            this.write(Object.assign(Object.assign({}, this.read()), { [table]: {} }));
        }
        ;
    }
    ;
    createTable(table) {
        if (!this.checkFile()) {
            node_fs_1.default.writeFileSync(this.path, JSON.stringify({}));
        }
        ;
        if (!this.read()[table]) {
            this.write(Object.assign(Object.assign({}, this.read()), { [table]: {} }));
        }
        ;
        return true;
    }
    ;
    tables() {
        return Object.keys(this.read());
    }
    ;
    // Inserters/Updaters
    insert(table, array) {
        const data = this.read();
        const tableData = data[table] || {};
        for (const { key, value } of array) {
            tableData[key] = value;
        }
        ;
        data[table] = tableData;
        this.write(data);
        return true;
    }
    ;
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
        return [this.read()[table] || {}, true];
    }
    ;
    getRowByKey(table, key) {
        return this.read()[table] ? this.read()[table][key] || undefined : undefined;
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
        if (!this.checkFile()) {
            return {};
        }
        return JSON.parse(node_fs_1.default.readFileSync(this.path).toString());
    }
    ;
    write(data) {
        if (this.format) {
            node_fs_1.default.writeFileSync(this.path, JSON.stringify(data, null, 2));
        }
        else {
            node_fs_1.default.writeFileSync(this.path, JSON.stringify(data));
        }
    }
    ;
    clear() {
        this.write({});
    }
    ;
}
exports.JSONDriver = JSONDriver;
;
//# sourceMappingURL=JSON.js.map