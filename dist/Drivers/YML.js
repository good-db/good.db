"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YMLDriver = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class YMLDriver {
    path;
    constructor(options) {
        this.path = options?.path || './db.yml';
        this.init();
    }
    ;
    checkFile() {
        return fs_1.default.existsSync(this.path);
    }
    init() {
        if (!this.checkFile()) {
            fs_1.default.writeFileSync(this.path, '');
        }
    }
    ;
    read() {
        const fileContent = fs_1.default.readFileSync(this.path, 'utf8');
        return js_yaml_1.default.load(fileContent) || {};
    }
    ;
    write(data) {
        const yamlString = js_yaml_1.default.dump(data);
        fs_1.default.writeFileSync(this.path, yamlString);
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