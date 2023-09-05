/**
 * Represents a YAML-based database instance.
 */
export default class BaseYAMLInstance {
    readonly fileName: string;
    readonly nestedEnabled: boolean;
    readonly separator: string;
    /**
     * Creates a new instance of the BaseYAMLInstance class.
     * @param {string} filePath - Path to the YAML file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     */
    constructor(filePath: string, nestedEnabled?: boolean, separator?: string);
    /**
     * Loads YAML content from the file.
     * @returns {object|null} - Parsed YAML data.
     */
    private loadYamlFromFile;
    /**
     * Saves YAML content to the file.
     * @param {object} data - Data to be saved.
     */
    private saveYamlToFile;
    /**
     * Sets a value in the database.
     * @param {string} key - Key to set.
     * @param {any} value - Value to set.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    set(key: string, value: any, nestedEnabled?: boolean, separator?: string): void;
    /**
     * Gets a value from the database.
     * @param {string} key - Key to get.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {any} - Retrieved value.
     */
    get(key: string, nestedEnabled?: boolean, separator?: string): any;
    /**
     * Fetches a value from the database.
     * @param {string} key - Key to fetch.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {any} - Fetched value.
     */
    fetch(key: string, nestedEnabled?: boolean, separator?: string): any;
    /**
     * Deletes a value from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if deleted, false if not found.
     */
    delete(key: string, nestedEnabled?: Boolean, separator?: string): boolean;
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if exists, false otherwise.
     */
    has(key: string, nestedEnabled?: boolean, separator?: string): boolean;
    /**
     * Adds a value to the existing value in the database.
     * @param {string} key - Key to add to.
     * @param {number} value - Value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    add(key: string, value: number, nestedEnabled?: boolean, separator?: string): void;
    /**
     * Subtracts a value from the existing value in the database.
     * @param {string} key - Key to subtract from.
     * @param {number} value - Value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    subtract(key: string, value: number, nestedEnabled?: boolean, separator?: string): void;
    /**
     * Pushes a value to an array in the database.
     * @param {string} key - Key of the array.
     * @param {any} value - Value to push.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    push(key: string, value: any, nestedEnabled?: boolean, separator?: string): void;
    /**
     * Pulls a value from an array in the database.
     * @param {string} key - Key of the array.
     * @param {any} callbackOrValue - Value or callback to match for removal.
     * @param {boolean} [pullAll=false] - Pull all matching values.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if pulled, false if not found.
     */
    pull(key: string, callbackOrValue: any, pullAll?: boolean, nestedEnabled?: boolean, separator?: string): boolean;
    /**
     * Retrieves the number of key-value pairs from the database.
     * @param {number} [type=0] - Determines what to retrieve:
     *   - 0: Returns an array of objects containing ID and data for each key-value pair.
     *   - 1: Returns an array containing all keys.
     * @returns {Promise<any[]>} - An array of key-value pairs or keys based on the specified type.
     * @throws {DatabaseError} Throws an error if the type is not 0 or 1.
     * @example
     * // Retrieve an array of key-value pairs.
     * await db.all(0);
     *
     * // Retrieve an array of keys.
     * await db.all(1);
     */
    all(type?: number): any;
    /**
     * Resets the entire database, removing all key-value pairs.
     * @example db.reset();
     */
    reset(): void;
    /**
     * Create a snapshot of the current database state and store it in a separate YAML file.
     * @param {string} snapshotName - The name of the snapshot.
     * @throws {DatabaseError} If a snapshot with the same name already exists.
     * @example
     * db.createSnapshot('backup1');
     */
    createSnapshot(snapshotName: string): void;
    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * db.rollbackToSnapshot('backup1');
     */
    rollbackToSnapshot(snapshotName: string): void;
}
