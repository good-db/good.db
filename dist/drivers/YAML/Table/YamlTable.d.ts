import TableInstance from './TableInstance';
export default class YAMLTable {
    private folderName;
    private folderPath;
    /**
     * Create a new YAMLTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example
     * new YAMLTable('tables/tables')
     * new YAMLTable('tables')
     */
    constructor(folderName: string);
    /**
     * Set up the folder for table storage.
     * Creates the folder if it doesn't exist.
     * @private
     */
    private setupFolder;
    /**
     * Create a new table instance.
     * @param {string} tableName - The name of the table.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example db.table('test', true, '..')
     */
    table(tableName: string, nestedEnabled?: boolean, separator?: string): TableInstance;
}
