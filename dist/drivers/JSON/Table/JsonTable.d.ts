import TableInstance from './TableInstance';
declare class JSONTable extends TableInstance {
    private folderName;
    private folderPath;
    /**
     * Create a new JSONTable instance.
     * @param {string} folderName - The name of the folder where table files will be stored.
     * @example
     * new JSONTable('tables/tables')
     * new JSONTable('tables')
     */
    constructor(folderName: string, tableName: string, nestedEnabled?: boolean, separator?: string);
    /**
     * Set up the folder for table storage.
     * Creates the folder if it doesn't exist.
     * @private
     */
    private setupFolder;
}
export default JSONTable;
