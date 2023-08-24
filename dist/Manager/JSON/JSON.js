"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseJsonInstance_1 = __importDefault(require("./BaseJsonInstance"));
/**
 * Represents a database instance.
 * @extends BaseJSONInstance
 */
class DataBaseJSON extends BaseJsonInstance_1.default {
    /**
     * Create a new instance of the database.
     * @param {string} [filePath='database.json'] - The path to the database JSON file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example new DataBaseJSON('database.json', true, '..')
     */
    constructor(filePath = 'database.json', nestedEnabled = true, separator = '..') {
        super(filePath, nestedEnabled, separator);
    }
}
exports.default = DataBaseJSON;
//# sourceMappingURL=JSON.js.map