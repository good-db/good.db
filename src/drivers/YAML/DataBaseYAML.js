"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseYAMLInstance_1 = __importDefault(require("./BaseYAMLInstance"));
/**
 * Represents a database instance.
 * @extends BaseYAMLInstance
 */
class DataBaseYAML extends BaseYAMLInstance_1.default {
    /**
     * Create a new instance of the database.
     * @param {string} [filePath='database.json'] - The path to the database JSON file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example new DataBaseYAML('database.yaml', true, '..')
     */
    constructor(filePath = 'database.yaml', nestedEnabled = true, separator = '..') {
        super(filePath, nestedEnabled, separator);
    }
}
exports.default = DataBaseYAML;
