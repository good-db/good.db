"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const TableInstance_1 = __importDefault(require("./TableInstance"));
class JSONTable {
    folderName;
    folderPath;
    /**
     * Create a new JSONTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example
     * new JSONTable('tables/tables')
     * new JSONTable('tables')
     */
    constructor(folderName = 'json_tables') {
        this.folderName = folderName;
        // Initialize the folder path
        this.folderPath = `./${this.folderName}`;
        this.setupFolder();
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
    /**
     * Create a new table instance.
     * @param {string} tableName - The name of the table.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example
     * ```typescript
     * let yml = db.table('test', true, '..')
     * yml.set('test', 'Hello world.')
     * ```
     */
    table(tableName, nestedEnabled = true, separator = '..') {
        return new TableInstance_1.default(this.folderPath, tableName, nestedEnabled, separator);
    }
}
exports.default = JSONTable;
//# sourceMappingURL=Main.js.map