"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YMLDriver = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class YMLDriver {
    constructor(options) {
        this.options = options;
        this.path = (options === null || options === void 0 ? void 0 : options.path) || './db.yml';
    }
    ;
    checkFile() {
        return node_fs_1.default.existsSync(this.path);
    }
    ;
    init(table) {
        if (!this.checkFile()) {
            node_fs_1.default.writeFileSync(this.path, '');
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
            node_fs_1.default.writeFileSync(this.path, '');
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
        const fileContent = node_fs_1.default.readFileSync(this.path, 'utf8');
        return js_yaml_1.default.load(fileContent) || {};
    }
    ;
    write(data) {
        const yamlString = js_yaml_1.default.dump(data);
        node_fs_1.default.writeFileSync(this.path, yamlString);
        return true;
    }
    ;
    clear() {
        this.write({});
        return true;
    }
    ;
}
exports.YMLDriver = YMLDriver;
;
//# sourceMappingURL=YML.js.map