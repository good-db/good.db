import fs from 'fs';
import TableInstance from './TableInstance';

class JSONTable {
    private folderPath: string;

    /**
     * Create a new JSONTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example 
     * new JSONTable('tables/tables')
     * new JSONTable('tables')
     */
    constructor(private folderName: string) {
        // Initialize the folder path
        this.folderPath = `./${this.folderName}`;
        this.setupFolder();
    }

    /**
     * Set up the folder for table storage.
     * Creates the folder if it doesn't exist.
     * @private
     */
    private setupFolder() {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }
    }

    /**
     * Create a new table instance.
     * @param {string} tableName - The name of the table.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example db.table('test', true, '..')
     */
    table(tableName: string, nestedEnabled: boolean = true, separator: string = '..'): TableInstance {
        return new TableInstance(this.folderPath, tableName, nestedEnabled, separator);
    }
}

export default JSONTable;
