import BaseSQLITEInstance from './BaseSQLITEInstance';
import DatabaseError from '../Error/Error';

export default class DataBaseSQLITE {
    private driver: BaseSQLITEInstance;
    private tableName: string;
    private nestedEnabled: boolean;
    private separator: string;
    private path: string;

    constructor(path: string = 'json.sqlite', table: string = "json", nestedEnabled: boolean = true, separator: string = '..') {
        this.path = path;
        this.driver = new BaseSQLITEInstance(path);
        this.tableName = table;
        this.driver.prepare(this.tableName)
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
    async set(key: string, value: any, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (typeof key != "string") {
            throw new DatabaseError(
                `First argument (key) needs to be a string received "${typeof key}"`
            );
        }

        if (nestedEnabled && key.includes(separator)) {
            const keyParts = key.split(separator);

            let [result, exist] = await this.driver.getRowByKey(
                this.tableName,
                keyParts[0]
            ) ?? {};

            if (!result) {
                result = {};
                exist = false;
            }

            let currentObject = result;

            for (let i = 0; i < keyParts.slice(1).length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part]) currentObject[part] = {};
                else if (typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            currentObject[lastPart] = value;

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
    async get(key: string, nestedEnabled: Boolean = this.nestedEnabled, separator: string = this.separator): Promise<any | null> {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            const [value] = await this.driver.getRowByKey(this.tableName, keyParts[0]);
            if (!value) return null;

            let currentValue = value;
            for (const part of keyParts.slice(1)) {
                if (!currentValue[part]) return null;
                currentValue = currentValue[part];
            }

            return currentValue;
        } else {
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
    async fetch(key: string, nestedEnabled: Boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        return await this.get(key, nestedEnabled, separator)
    }

    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example await db.delete("name");
     */
    async delete(key: string, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator): Promise<boolean> {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let [result, exist] = await this.driver.getRowByKey(
                this.tableName,
                keyParts[0]
            ) ?? [null, false];

            if (!result) {
                return false; // Key doesn't exist, no need to delete
            }

            let currentObject = result;

            for (let i = 0; i < keyParts.slice(1).length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject.hasOwnProperty(part)) return false;
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];

            if (!currentObject.hasOwnProperty(lastPart)) return false;
            delete currentObject[lastPart];

            // Remove empty nested objects
            while (Object.keys(result).length === 1 && typeof result === 'object') {
                const soleKey = Object.keys(result)[0];
                if (Object.keys(result[soleKey]).length === 0) {
                    delete result[soleKey];
                    keyParts.pop();
                    [result, exist] = await this.driver.getRowByKey(this.tableName, keyParts.join(separator)) ?? [null, false];
                    currentObject = result;
                    for (let i = 0; i < keyParts.length - 1; i++) {
                        const part = keyParts[i];
                        currentObject = currentObject[part];
                    }
                } else {
                    break;
                }
            }

            if (Object.keys(result).length === 0) {
                await this.driver.deleteRowByKey(this.tableName, keyParts[0]);
                return true
            } else {
                await this.driver.setRowByKey(this.tableName, keyParts[0], result, exist);
                return true
            }
        } else {
            const [result, exist] = await this.driver.getRowByKey(this.tableName, key) ?? [null, false];

            if (!result) return false;

            delete result[key];
            return await this.driver.setRowByKey(this.tableName, key, result, exist);
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
    async has(key: string, nestedEnabled: Boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        if (await this.get(key, nestedEnabled, separator)) return true;
        else return false;
    }

    /**
     * Adds a numeric value to an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to add the value to.
     * @param {number} value - Numeric value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.add("score", 10);
     */
    async add(key: string, value: number, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator): Promise<void> {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        let currentValue: any = await this.get(key, nestedEnabled, separator) || 0;

        if (typeof currentValue != 'number') throw new DatabaseError(`Cannot push to a non-number value at key '${key}'`);

        const newValue = currentValue + value;

        await this.set(key, newValue, nestedEnabled, separator);
        return
    }


    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.subtract("score", 5);
     */
    async subtract(key: string, value: number, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator): Promise<void> {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        let currentValue: any = await this.get(key, nestedEnabled, separator) || 0;

        if (typeof currentValue != 'number') throw new DatabaseError(`Cannot push to a non-number value at key '${key}'`);

        const newValue = currentValue - value;

        await this.set(key, newValue, nestedEnabled, separator);
        return
    }

    /**
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example await db.push("myArray", "new element");
     */
    async push(key: string, value: any, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        const array = await this.get(key, nestedEnabled, separator) || [];

        if (!Array.isArray(array)) throw new DatabaseError(`Cannot push to a non-array value at key '${key}'`);

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
    async pull(key: string, callbackOrValue: any, pullAll: boolean = false, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");

        const data: any = await this.get(key);
        if (!data) return false;

        const traverseAndPull = async (currentObject: any, keyParts: string[], depth: number): Promise<boolean> => {
            const part = keyParts[depth];

            if (depth === keyParts.length - 1) {
                if (!Array.isArray(currentObject)) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }

                const array = currentObject;
                let removed = false;

                if (pullAll) {
                    const indexesToRemove: number[] = [];
                    array.forEach((element: any, index: number) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;

                            if (callback(element, index, array)) {

                                indexesToRemove.push(index);
                            }
                        } else {
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
                } else {
                    const indexesToRemove: number[] = [];
                    array.forEach((element: any, index: number) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;

                            if (callback(element, index, array)) {
                                indexesToRemove.push(index);
                            }
                        } else {
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
                    await this.set(key, data, nestedEnabled, separator)
                }
                return removed;
            } else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot pull from a non-object include array value at key '${key}'`);
                }

                const updated = await traverseAndPull(currentObject[part], keyParts, depth + 1);

                if (updated) await this.set(key, data, nestedEnabled, separator);
                return updated;
            }
        };

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            return await traverseAndPull(data, keyParts, 0);
        } else {
            if (!Array.isArray(data)) {
                throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
            }

            let removed = false;

            if (pullAll) {
                const indexesToRemove: number[] = [];
                data.forEach((element: any, index: number) => {
                    if (typeof callbackOrValue === 'function') {
                        const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;
                        if (callback(element, index, data)) {
                            indexesToRemove.push(index);
                        }
                    } else {
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
            } else {
                data.forEach((element: any, index: number) => {
                    if (!removed) { 
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;
                            if (callback(element, index, data)) {
                                data.splice(index, 1);
                                removed = true;
                            }
                        } else {
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
                await this.set(key, data, nestedEnabled, separator)
            }
            return removed;
        }
    }

    /**
     * Retrieves all key-value pairs from the database.
    * @returns {Array} - An array containing objects with the ID (key) and data (value).
    * @example await db.all();
    */
    async all() {
        const data: any = await this.driver.getAllRows(this.tableName);
        const keys = Object.keys(data);
        const result = [];

        
        for (const key of keys) {
            result.push({ ID: data[key].id, data: data[key].value });
        }

        return result;
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
    async createSnapshot(snapshotName: string): Promise<void> {
        if (!snapshotName) throw new DatabaseError("The snapshotName is required!");
    
        
        const data = await this.driver.getAllRows(this.tableName);
        const snapshotsTableName = "snapshots"; // Name of the snapshots table
        
        await this.driver.prepare(snapshotsTableName)
    
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
    async rollbackToSnapshot(snapshotName: string): Promise<void> {
        if (!snapshotName) throw new DatabaseError("The snapshotName is required!");
    
        const snapshotsTableName = "snapshots"; // Name of the snapshots table
        const [result] = await this.driver.getRowByKey(snapshotsTableName, snapshotName);
        
        if (result) {

            await this.driver.deleteAllRows(this.tableName)
            result.data.forEach(async (data: { id: string, value: any }) => {
                await this.driver.setRowByKey(this.tableName, data.id, data.value)
            })
            
        } else {
            throw new DatabaseError("Snapshot not found.");
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
    async table(table: string, nestedEnabled: boolean = true, separate: string = '..'){
        await this.driver.prepare(table);
        return new DataBaseSQLITE(this.path, table, nestedEnabled, separate);
    }
    
}
