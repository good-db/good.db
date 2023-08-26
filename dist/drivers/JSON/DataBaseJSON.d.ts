import BaseJSONInstance from './BaseJsonInstance';
/**
 * Represents a database instance.
 * @extends BaseJSONInstance
 */
export default class DataBaseJSON extends BaseJSONInstance {
    /**
     * Create a new instance of the database.
     * @param {string} [filePath='database.json'] - The path to the database JSON file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example new DataBaseJSON('database.json', true, '..')
     */
    constructor(filePath?: string, nestedEnabled?: boolean, separator?: string);
}
