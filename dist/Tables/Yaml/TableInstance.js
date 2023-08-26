"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseYAMLInstance_1 = __importDefault(require("../../drivers/YAML/BaseYAMLInstance"));
class TableInstance extends BaseYAMLInstance_1.default {
    constructor(filePath, tableName, nestedEnabled = true, separator = '..') {
        super(`${filePath}/${tableName}.yaml`, nestedEnabled, separator);
    }
}
exports.default = TableInstance;
//# sourceMappingURL=TableInstance.js.map