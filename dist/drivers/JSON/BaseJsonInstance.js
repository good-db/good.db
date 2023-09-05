"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Error_1 = __importDefault(require("../Error/Error"));
class BaseJSONInstance {
    #fileName;
    #nestedEnabled;
    #separator;
    constructor(filePath, nestedEnabled = true, separator = '..') {
        this.#fileName = filePath;
        this.#nestedEnabled = nestedEnabled;
        this.#separator = separator;
        const lastIndex = this.#fileName.lastIndexOf('/');
        const databaseDir = this.#fileName.substring(0, lastIndex);
        if (!fs_1.default.existsSync(databaseDir) && databaseDir)
            fs_1.default.mkdirSync(databaseDir, { recursive: true });
        if (!fs_1.default.existsSync(this.#fileName))
            fs_1.default.writeFileSync(this.#fileName, "{}");
    }
    /**
     * Sets a key-value pair in the database.
     * @param {any} key Key to set.
     * @param {string} value Value to set.
     * @param {boolean} [nestedEnabled] Enable nested keys.
     * @param {string} [separator] Separator for nested keys.
     * @example db.set("name", "John Doe");
     */
    set(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part])
                    currentObject[part] = {};
                else if (typeof currentObject[part] !== 'object')
                    throw new Error_1.default(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                currentObject = currentObject[part];
            }
            const lastPart = keyParts[keyParts.length - 1];
            currentObject[lastPart] = value;
        }
        else {
            file[key] = value;
        }
        fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.get("name");
    */
    get(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentValue = file;
            for (const part of keyParts) {
                if (!currentValue.hasOwnProperty(part))
                    return undefined;
                currentValue = currentValue[part];
            }
            return currentValue;
        }
        else {
            return file[key];
        }
    }
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.fetch("name");
    */
    fetch(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        return this.get(key, nestedEnabled, separator);
    }
    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example db.delete("name");
     */
    delete(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentValue = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentValue.hasOwnProperty(part))
                    return false;
                currentValue = currentValue[part];
            }
            const lastPart = keyParts[keyParts.length - 1];
            if (currentValue.hasOwnProperty(lastPart)) {
                delete currentValue[lastPart];
                fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return true;
            }
            else
                return false;
        }
        else {
            if (file.hasOwnProperty(key)) {
                delete file[key];
                fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return true;
            }
            else
                return false;
        }
    }
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the key exists, otherwise false.
     * @example db.has("name");
     */
    has(key, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (this.get(key, nestedEnabled, separator))
            return true;
        else
            return false;
    }
    /**
     * Adds a numeric value to an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to add the value to.
     * @param {number} value - Numeric value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.add("score", 10);
     */
    add(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (typeof value !== 'number')
            throw new Error_1.default("The value must be a number!");
        let currentValue = this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue != 'number')
            throw new Error_1.default(`Cannot push to a non-number value at key '${key}'`);
        const newValue = currentValue + value;
        this.set(key, newValue, nestedEnabled, separator);
    }
    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.subtract("score", 5);
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
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.push("myArray", "new element");
     */
    push(key, value, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject.hasOwnProperty(part)) {
                    currentObject[part] = {};
                }
                else if (typeof currentObject[part] !== 'object') {
                    throw new Error_1.default(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }
            const lastPart = keyParts[keyParts.length - 1];
            if (!currentObject || typeof currentObject !== 'object') {
                throw new Error_1.default(`Cannot push to a non-array value at key '${key}'`);
            }
            if (!currentObject[lastPart]) {
                currentObject[lastPart] = [];
            }
            else if (!Array.isArray(currentObject[lastPart])) {
                throw new Error_1.default(`Cannot push to a non-array value at key '${key}'`);
            }
            currentObject[lastPart].push(value);
        }
        else {
            if (!file.hasOwnProperty(key)) {
                file[key] = [value];
            }
            else {
                if (!Array.isArray(file[key])) {
                    throw new Error_1.default(`Cannot push to a non-array value at key '${key}'`);
                }
                file[key].push(value);
            }
        }
        fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }
    /**
     * Removes elements from an array associated with the provided key in the database based on a callback function or a specific value.
    * @param {string} key - Key of the array to pull from.
    * @param {any} callbackOrValue - Callback function or value to remove from the array.
    * @param {boolean} [pullAll=false] - If true, removes all elements that match the condition.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {boolean} - Returns true if any elements were removed, otherwise false.
    * @example db.pull("myArray", (element) => element > 10);
    */
    pull(key, callbackOrValue, pullAll = false, nestedEnabled = this.#nestedEnabled, separator = this.#separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};
        const traverseAndPull = (currentObject, keyParts, depth) => {
            const part = keyParts[depth];
            if (depth === keyParts.length - 1) {
                if (!currentObject.hasOwnProperty(part) || !Array.isArray(currentObject[part])) {
                    throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
                }
                const array = currentObject[part];
                let removed = false;
                if (pullAll) {
                    const indexesToRemove = array.reduce((acc, element, index) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, array)) {
                                acc.push(index);
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                acc.push(index);
                            }
                        }
                        return acc;
                    }, []);
                    if (indexesToRemove.length > 0) {
                        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                            array.splice(indexesToRemove[i], 1);
                        }
                        removed = true;
                    }
                }
                else {
                    const indexesToRemove = array.reduce((acc, element, index) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, array)) {
                                acc.push(index);
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                acc.push(index);
                            }
                        }
                        return acc;
                    }, []);
                    if (indexesToRemove.length > 0) {
                        array.splice(indexesToRemove[0], 1);
                        removed = true;
                    }
                }
                if (removed) {
                    fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                }
                return removed;
            }
            else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
                }
                const updated = traverseAndPull(currentObject[part], keyParts, depth + 1);
                if (updated)
                    fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return updated;
            }
        };
        if (nestedEnabled) {
            const keyParts = key.split(separator);
            return traverseAndPull(file, keyParts, 0);
        }
        else {
            if (!Array.isArray(file[key])) {
                throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
            }
            const array = file[key];
            let removed = false;
            if (pullAll) {
                const indexesToRemove = array.reduce((acc, element, index) => {
                    if (typeof callbackOrValue === 'function') {
                        const callback = callbackOrValue;
                        if (callback(element, index, array)) {
                            acc.push(index);
                        }
                    }
                    else {
                        const value = callbackOrValue;
                        if (element === value) {
                            acc.push(index);
                        }
                    }
                    return acc;
                }, []);
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
                fs_1.default.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
            }
            return removed;
        }
    }
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
    all(type = 0) {
        if (type === 0) {
            const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
            const file = fileContent ? JSON.parse(fileContent) : {};
            const keys = Object.keys(file);
            const result = [];
            for (const key of keys) {
                result.push({ ID: key, data: file[key] });
            }
            return result;
        }
        else if (type == 1) {
            const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
            const file = fileContent ? JSON.parse(fileContent) : {};
            let result = [];
            result.push(file);
            return result;
        }
        else {
            throw new Error_1.default("Invalid type, type must be 0 or 1");
        }
    }
    /**
     * Resets the entire database, removing all key-value pairs.
    * @example db.reset();
    */
    reset() {
        return fs_1.default.writeFileSync(this.#fileName, JSON.stringify({}, null, 2));
    }
    /**
     * Create a snapshot of the current database state and store it in a separate JSON file.
     * @param {string} snapshotName - The name of the snapshot.
     * @throws {DatabaseError} If a snapshot with the same name already exists.
     * @example
     * db.createSnapshot('backup1');
     */
    createSnapshot(snapshotName) {
        const fileContent = fs_1.default.readFileSync(this.#fileName, "utf8");
        const fileData = fileContent ? JSON.parse(fileContent) : {};
        const snapshotsFile = 'snapshots.json'; // Name of the snapshot file
        const snapshotsData = fs_1.default.existsSync(snapshotsFile)
            ? JSON.parse(fs_1.default.readFileSync(snapshotsFile, 'utf8'))
            : [];
        const existingSnapshot = snapshotsData.find((snapshot) => snapshot.name === snapshotName);
        if (existingSnapshot)
            throw new Error_1.default("Snapshot with the same name already exists.");
        snapshotsData.push({ name: snapshotName, timestamp: Date.now(), data: fileData });
        fs_1.default.writeFileSync(snapshotsFile, JSON.stringify(snapshotsData, null, 2));
    }
    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * db.rollbackToSnapshot('backup1');
     */
    rollbackToSnapshot(snapshotName) {
        const snapshotsFile = 'snapshots.json';
        const snapshotsData = fs_1.default.existsSync(snapshotsFile)
            ? JSON.parse(fs_1.default.readFileSync(snapshotsFile, 'utf8'))
            : [];
        const snapshot = snapshotsData.find((snapshot) => snapshot.name === snapshotName);
        if (snapshot)
            fs_1.default.writeFileSync(this.#fileName, JSON.stringify(snapshot.data, null, 2));
        else
            throw new Error_1.default("Snapshot not found.");
    }
}
exports.default = BaseJSONInstance;
//# sourceMappingURL=BaseJsonInstance.js.map