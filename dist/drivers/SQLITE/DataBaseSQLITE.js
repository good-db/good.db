"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSQLITEInstance_1 = __importDefault(require("./BaseSQLITEInstance"));
const Error_1 = __importDefault(require("../Error/Error"));
class DataBaseSQLITE {
    driver;
    tableName;
    nestedEnabled;
    separator;
    path;
    constructor(path = 'json.sqlite', table = "json", nestedEnabled = true, separator = '..') {
        this.path = path;
        this.driver = new BaseSQLITEInstance_1.default(path);
        this.tableName = table;
        this.driver.prepare(this.tableName);
        this.nestedEnabled = nestedEnabled;
        this.separator = separator;
    }
    /**
     * Sets a key-value pair in the database.
     * @param {any} key Key to set.
     * @param {string} value Value to set.
     * @param {boolean} [nestedEnabled] Enable nested keys.
     * @param {string} [separator] Separator for nested keys.
     * @example await db.set("name", "John Doe");
     */
    async set(key, value, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (typeof key != "string") {
            throw new Error_1.default(`First argument (key) needs to be a string received "${typeof key}"`);
        }
        if (nestedEnabled && key.includes(separator)) {
            const keyParts = key.split(separator);
            let [result, exist] = await this.driver.getRowByKey(this.tableName, keyParts[0]) ?? {};
            if (!result) {
                result = {};
                exist = false;
            }
            let currentObject = result;
            let currentKey = keyParts.slice(1);
            for (let i = 0; i < currentKey.length; i++) {
                const part = currentKey[i];
                if (!currentObject[part])
                    currentObject[part] = {};
                if (typeof currentObject[part] !== 'object' && i !== currentKey.length - 1) {
                    throw new Error_1.default(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                if (i === currentKey.length - 1)
                    currentObject[part] = value;
                currentObject = currentObject[part];
            }
            return await this.driver.setRowByKey(this.tableName, keyParts[0], result, exist);
        }
        const exist = (await this.driver.getRowByKey(this.tableName, key))[1];
        return this.driver.setRowByKey(this.tableName, key, value, exist);
    }
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example await db.get("name");
    */
    async get(key, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (nestedEnabled && key.includes(separator)) {
            const keyParts = key.split(separator);
            const [value] = await this.driver.getRowByKey(this.tableName, keyParts[0]);
            if (!value)
                return null;
            let currentValue = value;
            for (const part of keyParts.slice(1)) {
                if (!currentValue[part])
                    return null;
                currentValue = currentValue[part];
            }
            return currentValue;
        }
        else {
            const [value] = await this.driver.getRowByKey(this.tableName, key);
            return value ? value : null;
        }
    }
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example await db.fetch("name");
    */
    async fetch(key, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        return await this.get(key, nestedEnabled, separator);
    }
    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example await db.delete("name");
     */
    async delete(key, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (nestedEnabled && key.includes(separator)) {
            const keyParts = key.split(separator);
            if (await this.get(key)) {
                this.driver.deleteRowByKey(this.tableName, keyParts[0]);
                return true;
            }
            else
                false;
        }
        else {
            this.driver.deleteRowByKey(this.tableName, key);
            return true;
        }
    }
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the key exists, otherwise false.
     * @example await db.has("name");
     */
    async has(key, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (await this.get(key, nestedEnabled, separator))
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
     * @example await db.add("score", 10);
     */
    async add(key, value, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (typeof value !== 'number')
            throw new Error_1.default("The value must be a number!");
        let currentValue = await this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue != 'number')
            throw new Error_1.default(`Cannot push to a non-number value at key '${key}'`);
        const newValue = currentValue + value;
        await this.set(key, newValue, nestedEnabled, separator);
        return;
    }
    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.subtract("score", 5);
     */
    async subtract(key, value, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        if (typeof key !== 'string')
            throw new Error_1.default("The key must be a string!");
        if (typeof value !== 'number')
            throw new Error_1.default("The value must be a number!");
        let currentValue = await this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue != 'number')
            throw new Error_1.default(`Cannot push to a non-number value at key '${key}'`);
        const newValue = currentValue - value;
        await this.set(key, newValue, nestedEnabled, separator);
        return;
    }
    /**
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.push("myArray", "new element");
     */
    async push(key, value, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const array = await this.get(key, nestedEnabled, separator) || [];
        if (!Array.isArray(array))
            throw new Error_1.default(`Cannot push to a non-array value at key '${key}'`);
        array.push(value);
        await this.set(key, array, nestedEnabled, separator);
    }
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
    async pull(key, callbackOrValue, pullAll = false, nestedEnabled = this.nestedEnabled, separator = this.separator) {
        if (!key)
            throw new Error_1.default("The key is not defined!");
        const data = await this.get(key);
        if (!data)
            return false;
        const traverseAndPull = async (currentObject, keyParts, depth) => {
            const part = keyParts[depth];
            if (depth === keyParts.slice(1).length) {
                if (!Array.isArray(currentObject)) {
                    throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
                }
                const array = currentObject;
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
                    await this.set(key, data, nestedEnabled, separator);
                }
                return removed;
            }
            else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new Error_1.default(`Cannot pull from a non-object include array value at key '${key}'`);
                }
                const updated = await traverseAndPull(currentObject[part], keyParts, depth + 1);
                if (updated)
                    await this.set(key, data, nestedEnabled, separator);
                return updated;
            }
        };
        if (nestedEnabled && key.includes(separator)) {
            const keyParts = key.split(separator);
            return await traverseAndPull(data, keyParts, 0);
        }
        else {
            if (!Array.isArray(data)) {
                throw new Error_1.default(`Cannot pull from a non-array value at key '${key}'`);
            }
            let removed = false;
            if (pullAll) {
                const indexesToRemove = [];
                data.forEach((element, index) => {
                    if (typeof callbackOrValue === 'function') {
                        const callback = callbackOrValue;
                        if (callback(element, index, data)) {
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
                        data.splice(indexesToRemove[i], 1);
                    }
                    removed = true;
                }
            }
            else {
                data.forEach((element, index) => {
                    if (!removed) {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue;
                            if (callback(element, index, data)) {
                                data.splice(index, 1);
                                removed = true;
                            }
                        }
                        else {
                            const value = callbackOrValue;
                            if (element === value) {
                                data.splice(index, 1);
                                removed = true;
                            }
                        }
                    }
                });
            }
            if (removed) {
                await this.set(key, data, nestedEnabled, separator);
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
    async all(type = 0) {
        if (typeof type !== 'number')
            throw new Error_1.default("The type must be a number!");
        if (type === 0) {
            const data = await this.driver.getAllRows(this.tableName);
            const keys = Object.keys(data);
            const result = [];
            for (const key of keys) {
                result.push({ ID: data[key].id, data: data[key].value });
            }
            return result;
        }
        else if (type === 1) {
            const data = await this.driver.getAllRows(this.tableName);
            const result = [];
            for (let i = 0; i < data.length; i++) {
                result[data[i].id] = data[i].value;
            }
            return result;
        }
        else {
            throw new Error_1.default("Invalid type, type must be 0 or 1");
        }
    }
    /**
     * Resets the entire database, removing all key-value pairs.
    * @example await db.reset();
    */
    async reset() {
        await this.driver.deleteAllRows(this.tableName);
    }
    /**
     * Create a snapshot of the current database state and store it in a separate JSON file.
     * @param {string} snapshotName - The name of the snapshot.
     * @throws {DatabaseError} If a snapshot with the same name already exists.
     * @example
     * await db.createSnapshot('backup1');
     */
    async createSnapshot(snapshotName) {
        if (!snapshotName)
            throw new Error_1.default("The snapshotName is required!");
        const data = await this.driver.getAllRows(this.tableName);
        const snapshotsTableName = "snapshots"; // Name of the snapshots table
        await this.driver.prepare(snapshotsTableName);
        const newSnapshotData = {
            name: snapshotName,
            timestamp: new Date().toISOString(),
            data: data
        };
        const exist = (await this.driver.getRowByKey(snapshotsTableName, snapshotName))[1];
        await this.driver.setRowByKey(snapshotsTableName, snapshotName, newSnapshotData, exist);
    }
    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * await db.rollbackToSnapshot('backup1');
     */
    async rollbackToSnapshot(snapshotName) {
        if (!snapshotName)
            throw new Error_1.default("The snapshotName is required!");
        const snapshotsTableName = "snapshots"; // Name of the snapshots table
        const [result] = await this.driver.getRowByKey(snapshotsTableName, snapshotName);
        if (result) {
            await this.driver.deleteAllRows(this.tableName);
            result.data.forEach(async (data) => {
                await this.driver.setRowByKey(this.tableName, data.id, data.value);
            });
        }
        else {
            throw new Error_1.default("Snapshot not found.");
        }
    }
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
    async table(table, nestedEnabled = true, separate = '..') {
        await this.driver.prepare(table);
        return new DataBaseSQLITE(this.path, table, nestedEnabled, separate);
    }
}
exports.default = DataBaseSQLITE;
//# sourceMappingURL=DataBaseSQLITE.js.map