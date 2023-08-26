import TableInstance from './TableInstance';
export default class JSONTable {
    private folderName;
    private folderPath;
    /**
     * Create a new JSONTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example
     * new JSONTable('tables/tables')
     * new JSONTable('tables')
     */
    constructor(folderName?: string);
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
     * @example
     * ```typescript
     * let yml = db.table('test', true, '..')
     * yml.set('test', 'Hello world.')
     * ```
     */
    table(tableName: string, nestedEnabled?: boolean, separator?: string): TableInstance;
}
