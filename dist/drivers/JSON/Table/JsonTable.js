"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const TableInstance_1 = __importDefault(require("./TableInstance"));
const Error_1 = __importDefault(require("../../Error/Error"));
class JSONTable extends TableInstance_1.default {
    folderName;
    folderPath;
    /**
     * Create a new JSONTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example
     * new JSONTable('tables/tables')
     * new JSONTable('tables')
     */
    constructor(folderName = 'tables', tableName, nestedEnabled = true, separator = '..') {
        // Initialize the folder path
        super(`./${folderName}`, tableName, nestedEnabled, separator);
        this.folderName = folderName;
        this.folderPath = `./${this.folderName}`;
        this.setupFolder();
        if (!tableName)
            throw new Error_1.default('Must add tableName to create table.');
    }
    /**
     * Set up the folder for table storage.
     * Creates the folder if it doesn't exist.
     * @private
     */
    setupFolder() {
        if (!fs_1.default.existsSync(this.folderPath)) {
            fs_1.default.mkdirSync(this.folderPath);
        }
    }
}
exports.default = JSONTable;
//# sourceMappingURL=JsonTable.js.map