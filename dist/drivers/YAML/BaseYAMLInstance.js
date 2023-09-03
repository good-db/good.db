"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const Error_1 = __importDefault(require("../Error/Error"));
/**
 * Represents a YAML-based database instance.
 */
class BaseYAMLInstance {
    #fileName;
    #nestedEnabled;
    #separator;
    /**
     * Creates a new instance of the BaseYAMLInstance class.
     * @param {string} filePath - Path to the YAML file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     */
    constructor(filePath, nestedEnabled = true, separator = '..') {
        this.#fileName = filePath;
        this.#nestedEnabled = nestedEnabled;
        this.#separator = separator;
        const lastIndex = this.#fileName.lastIndexOf('/');
        const databaseDir = this.#fileName.substring(0, lastIndex);
        if (!fs_1.default.existsSync(databaseDir) && databaseDir)
            fs_1.default.mkdirSync(databaseDir, { recursive: true });
        if (!fs_1.default.existsSync(this.#fileName))
            fs_1.default.writeFileSync(this.#fileName, "");
    }
    /**
     * Loads YAML content from the file.
     * @returns {object|null} - Parsed YAML data.
     */
    loadYamlFromFile() {
        try {
            const fileContent = fs_1.default.readFileSync(this.#fileName, 'utf8');
            return js_yaml_1.default.load(fileContent);
        }
        catch (error) {
            console.error('Error loading YAML file:', error);
            return null;
        }
    }
    /**
     * Saves YAML content to the file.
     * @param {object} data - Data to be saved.
     */
    saveYamlToFile(data) {
        try {
            const yamlContent = js_yaml_1.default.dump(data);
            fs_1.default.writeFileSync(this.#fileName, yamlContent, 'utf8');
        }
        catch (error) {
            console.error('Error saving YAML file:', error);
        }
    }
    /**
     * Sets a value in the database.
     * @param {string} key - Key to set.
     * @param {any} value - Value to set.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    set(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = this.loadYamlFromFile() || {};
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject = data;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part])
                    currentObject[part] = {};
                else if (typeof currentObject[part] !== 'object') {
                    throw new Error_1.default(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }
            const lastPart = keyParts[keyParts.length - 1];
            currentObject[lastPart] = value;
        }
        else {
            data[key] = value;
        }
        this.saveYamlToFile(data);
    }
    /**
     * Gets a value from the database.
     * @param {string} key - Key to get.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {any} - Retrieved value.
     */
    get(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = this.loadYamlFromFile();
        if (!data)
            return undefined;
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentValue = data;
            for (const part of keyParts) {
                if (!currentValue.hasOwnProperty(part))
                    return undefined;
                currentValue = currentValue[part];
            }
            return currentValue;
        }
        else {
            return data[key];
        }
    }
    /**
     * Fetches a value from the database.
     * @param {string} key - Key to fetch.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {any} - Fetched value.
     */
    fetch(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        return this.get(key, nestedEnabled, separator);
    }
    /**
     * Deletes a value from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if deleted, false if not found.
     */
    delete(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = this.loadYamlFromFile();
        if (!data)
            return false;
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject = data;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part])
                    return false;
                currentObject = currentObject[part];
            }
            const lastPart = keyParts[keyParts.length - 1];
            if (lastPart in currentObject) {
                delete currentObject[lastPart];
                this.saveYamlToFile(data);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (key in data) {
                delete data[key];
                this.saveYamlToFile(data);
                return true;
            }
            else {
                return false;
            }
        }
    }
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if exists, false otherwise.
     */
    has(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = this.loadYamlFromFile();
        if (!data)
            return false;
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentValue = data;
            for (const part of keyParts) {
                if (!currentValue.hasOwnProperty(part))
                    return false;
                currentValue = currentValue[part];
            }
            return true;
        }
        else {
            return key in data;
        }
    }
    /**
     * Adds a value to the existing value in the database.
     * @param {string} key - Key to add to.
     * @param {number} value - Value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    add(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (typeof value !== 'number')
            throw new Error_1.default("The value must be a number!");
        const currentValue = this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue != 'number')
            throw new Error_1.default(`Cannot push to a non-number value at key '${key}'`);
        const newValue = currentValue + value;
        this.set(key, newValue, nestedEnabled, separator);
    }
    /**
     * Subtracts a value from the existing value in the database.
     * @param {string} key - Key to subtract from.
     * @param {number} value - Value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    subtract(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (typeof value !== 'number')
            throw new Error_1.default("The value must be a number!");
        let currentValue = this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue == 'string')
            throw new Error_1.default(`Cannot push to a non-number value at key '${key}'`);
        const newValue = currentValue - value;
        this.set(key, newValue, nestedEnabled, separator);
    }
    /**
     * Pushes a value to an array in the database.
     * @param {string} key - Key of the array.
     * @param {any} value - Value to push.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    push(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const array = this.get(key, nestedEnabled, separator) || [];
        if (!Array.isArray(array))
            throw new Error_1.default(`Cannot push to a non-array value at key '${key}'`);
        array.push(value);
        this.set(key, array, nestedEnabled, separator);
    }
    /**
     * Pulls a value from an array in the database.
     * @param {string} key - Key of the array.
     * @param {any} callbackOrValue - Value or callback to match for removal.
     * @param {boolean} [pullAll=false] - Pull all matching values.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if pulled, false if not found.
     */
    pull(key, callbackOrValue, pullAll = false, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = this.loadYamlFromFile();
        if (!data)
            return false;
        const traverseAndPull = (currentObject, keyParts, depth) => {
            const part = keyParts[depth];
            if (depth === keyParts.length - 1) {
                if (!currentObject.hasOwnProperty(part) || !Array.isArray(currentObject[part])) {
                    throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
                }
                const array = currentObject[part];
                let removed = false;
                if (pullAll) {
                    const indexesToRemove = [];
                    array.forEach((element, index) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, array)) {
                                indexesToRemove.push(index);
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                indexesToRemove.push(index);
                            }
                        }
                    });
                    if (indexesToRemove.length > 0) {
                        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                            array.splice(indexesToRemove[i], 1);
                        }
                        removed = true;
                    }
                }
                else {
                    const indexesToRemove = [];
                    array.forEach((element, index) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, array)) {
                                indexesToRemove.push(index);
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                indexesToRemove.push(index);
                            }
                        }
                    });
                    if (indexesToRemove.length > 0) {
                        array.splice(indexesToRemove[0], 1);
                        removed = true;
                    }
                }
                if (removed) {
                    this.saveYamlToFile(data);
                }
                return removed;
            }
            else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
                }
                const updated = traverseAndPull(currentObject[part], keyParts, depth + 1);
                if (updated)
                    this.saveYamlToFile(data);
                return updated;
            }
        };
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            return traverseAndPull(data, keyParts, 0);
        }
        else {
            if (!Array.isArray(data)) {
                throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
            }
            const array = data;
            let removed = false;
            if (pullAll) {
                const indexesToRemove = [];
                array.forEach((element, index) => {
                    if (typeof callbackOrValue === 'function') {
                        const callback = callbackOrValue;
                        if (callback(element, index, array)) {
                            indexesToRemove.push(index);
                        }
                    }
                    else {
                        const value = callbackOrValue;
                        if (element === value) {
                            indexesToRemove.push(index);
                        }
                    }
                });
                if (indexesToRemove.length > 0) {
                    for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                        array.splice(indexesToRemove[i], 1);
                    }
                    removed = true;
                }
            }
            else {
                array.forEach((element, index) => {
                    if (!removed) {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, array)) {
                                array.splice(index, 1);
                                removed = true;
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                array.splice(index, 1);
                                removed = true;
                            }
                        }
                    }
                });
            }
            if (removed) {
                this.saveYamlToFile(data);
            }
            return removed;
        }
    }
    /**
     * Retrieves all key-value pairs from the database.
     * @returns {Array} - An array containing objects with the ID (key) and data (value).
     * @example db.all();
     */
    all() {
        const data = this.loadYamlFromFile();
        const keys = Object.keys(data);
        const result = [];
        for (const key of keys) {
            result.push({ ID: key, data: data[key] });
        }
        return result;
    }
    /**
     * Resets the entire database, removing all key-value pairs.
     * @example db.reset();
     */
    reset() {
        this.saveYamlToFile('');
    }
    /**
     * Create a snapshot of the current database state and store it in a separate YAML file.
     * @param {string} snapshotName - The name of the snapshot.
     * @throws {DatabaseError} If a snapshot with the same name already exists.
     * @example
     * db.createSnapshot('backup1');
     */
    createSnapshot(snapshotName) {
        if (!snapshotName)
            throw new Error_1.default("The snapshotName is required!");
        const data = this.loadYamlFromFile();
        const snapshotsFile = 'snapshots.yaml'; // Name of the snapshot file
        const snapshotsData = fs_1.default.existsSync(snapshotsFile)
            ? js_yaml_1.default.load(fs_1.default.readFileSync(snapshotsFile, 'utf8'))
            : [];
        const existingSnapshot = snapshotsData.find((snapshot) => snapshot.name === snapshotName);
        if (existingSnapshot)
            throw new Error_1.default("Snapshot with the same name already exists.");
        snapshotsData.push({ name: snapshotName, timestamp: new Date(), data: data });
        fs_1.default.writeFileSync(snapshotsFile, js_yaml_1.default.dump(snapshotsData, { indent: 2 }));
    }
    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * db.rollbackToSnapshot('backup1');
     */
    rollbackToSnapshot(snapshotName) {
        if (!snapshotName)
            throw new Error_1.default("The snapshotName is required!");
        const snapshotsFile = 'snapshots.yaml';
        const snapshotsData = fs_1.default.existsSync(snapshotsFile)
            ? js_yaml_1.default.load(fs_1.default.readFileSync(snapshotsFile, 'utf8'))
            : [];
        const snapshot = snapshotsData.find((snapshot) => snapshot.name === snapshotName);
        if (snapshot) {
            this.saveYamlToFile(snapshot.data);
        }
        else {
            throw new Error_1.default("Snapshot not found.");
        }
    }
}
exports.default = BaseYAMLInstance;
//# sourceMappingURL=BaseYAMLInstance.js.map