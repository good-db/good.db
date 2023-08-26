import BaseYAMLInstance from "./BaseYAMLInstance";
/**
 * Represents a database instance.
 * @extends BaseYAMLInstance
 */
export default class DataBaseYAML extends BaseYAMLInstance {
    /**
     * Create a new instance of the database.
     * @param {string} [filePath='database.json'] - The path to the database JSON file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     * @example new DataBaseYAML('database.yaml', true, '..')
     */
    constructor(filePath?: string, nestedEnabled?: boolean, separator?: string);
}
