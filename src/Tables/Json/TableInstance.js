"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseJsonInstance_1 = __importDefault(require("../../drivers/JSON/BaseJsonInstance"));
class TableInstance extends BaseJsonInstance_1.default {
    constructor(filePath, tableName, nestedEnabled = true, separator = '..') {
        super(`${filePath}/${tableName}.json`, nestedEnabled, separator);
    }
}
exports.default = TableInstance;
