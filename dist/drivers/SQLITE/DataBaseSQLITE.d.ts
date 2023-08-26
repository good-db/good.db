export default class DataBaseSQLITE {
    private driver;
    private tableName;
    private nestedEnabled;
    private separator;
    private path;
    constructor(path?: string, table?: string, nestedEnabled?: boolean, separator?: string);
    /**
     * Sets a key-value pair in the database.
     * @param {any} key Key to set.
     * @param {string} value Value to set.
     * @param {boolean} [nestedEnabled] Enable nested keys.
     * @param {string} [separator] Separator for nested keys.
     * @example await db.set("name", "John Doe");
     */
    set(key: string, value: any, nestedEnabled?: boolean, separator?: string): Promise<any>;
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example await db.get("name");
    */
    get(key: string, nestedEnabled?: Boolean, separator?: string): Promise<any | null>;
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example await db.fetch("name");
    */
    fetch(key: string, nestedEnabled?: Boolean, separator?: string): Promise<any>;
    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example await db.delete("name");
     */
    delete(key: string, nestedEnabled?: boolean, separator?: string): Promise<boolean>;
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the key exists, otherwise false.
     * @example await db.has("name");
     */
    has(key: string, nestedEnabled?: Boolean, separator?: string): Promise<boolean>;
    /**
     * Adds a numeric value to an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to add the value to.
     * @param {number} value - Numeric value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.add("score", 10);
     */
    add(key: string, value: number, nestedEnabled?: boolean, separator?: string): Promise<void>;
    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.subtract("score", 5);
     */
    subtract(key: string, value: number, nestedEnabled?: boolean, separator?: string): Promise<void>;
    /**
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.push("myArray", "new element");
     */
    push(key: string, value: any, nestedEnabled?: boolean, separator?: string): Promise<void>;
    /**
     * Removes elements from an array associated with the provided key in the database based on a callback function or a specific value.
    * @param {string} key - Key of the array to pull from.
    * @param {any} callbackOrValue - Callback function or value to remove from the array.
    * @param {boolean} [pullAll=false] - If true, removes all elements that match the condition.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {boolean} - Returns true if any elements were removed, otherwise false.
    * @example await db.pull("myArray", (element) => element > 10);
    */
    pull(key: string, callbackOrValue: any, pullAll?: boolean, nestedEnabled?: boolean, separator?: string): Promise<boolean>;
    /**
     * Retrieves all key-value pairs from the database.
    * @returns {Array} - An array containing objects with the ID (key) and data (value).
    * @example await db.all();
    */
    all(): Promise<{
        ID: any;
        data: any;
    }[]>;
    /**
     * Resets the entire database, removing all key-value pairs.
    * @example await db.reset();
    */
    reset(): Promise<void>;
    /**
     * Create a snapshot of the current database state and store it in a separate JSON file.
     * @param {string} snapshotName - The name of the snapshot.
     * @throws {DatabaseError} If a snapshot with the same name already exists.
     * @example
     * await db.createSnapshot('backup1');
     */
    createSnapshot(snapshotName: string): Promise<void>;
    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * await db.rollbackToSnapshot('backup1');
     */
    rollbackToSnapshot(snapshotName: string): Promise<void>;
    /**
     * Create a new instance of DataBaseSQLITE using a different table.
     * @param table - The name of the new table.
     * @param nestedEnabled - Whether nested keys are enabled for the new table.
     * @param separate - The separator for nested keys for the new table.
     * @returns A new DataBaseSQLITE instance using the specified table.
     * @example
     * ```typescript
     * const newTable = db.table('my_custom_table');
     * await newTable.set('key', 'value');
     * ```
     */
    table(table: string, nestedEnabled?: boolean, separate?: string): Promise<DataBaseSQLITE>;
}
