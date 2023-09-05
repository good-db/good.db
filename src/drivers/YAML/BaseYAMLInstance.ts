import fs from 'fs';
import yaml from 'js-yaml';
import DatabaseError from '../Error/Error';

/**
 * Represents a YAML-based database instance.
 */
export default class BaseYAMLInstance {
    public readonly fileName: string;
    public readonly nestedEnabled: boolean;
    public readonly separator: string;

    /**
     * Creates a new instance of the BaseYAMLInstance class.
     * @param {string} filePath - Path to the YAML file.
     * @param {boolean} [nestedEnabled=true] - Enable nested keys.
     * @param {string} [separator='..'] - Separator for nested keys.
     */
    constructor(filePath: string, nestedEnabled: boolean = true, separator: string = '..') {
        this.fileName = filePath;
        this.nestedEnabled = nestedEnabled;
        this.separator = separator;

        const lastIndex = this.fileName.lastIndexOf('/');
        const databaseDir = this.fileName.substring(0, lastIndex);

        if (!fs.existsSync(databaseDir) && databaseDir) fs.mkdirSync(databaseDir, { recursive: true });
        if (!fs.existsSync(this.fileName)) fs.writeFileSync(this.fileName, "");
    }

    /**
     * Loads YAML content from the file.
     * @returns {object|null} - Parsed YAML data.
     */
    private loadYamlFromFile() {
        try {
            const fileContent = fs.readFileSync(this.fileName, 'utf8');
            return yaml.load(fileContent);
        } catch (error) {
            console.error('Error loading YAML file:', error);
            return null;
        }
    }

    /**
     * Saves YAML content to the file.
     * @param {object} data - Data to be saved.
     */
    private saveYamlToFile(data: any) {
        try {
            const yamlContent = yaml.dump(data);
            fs.writeFileSync(this.fileName, yamlContent, 'utf8');
        } catch (error) {
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
    set(key: string, value: any, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");

        const data: any = this.loadYamlFromFile() || {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject: any = data;

            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part]) currentObject[part] = {};
                else if (typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            currentObject[lastPart] = value;
        } else {
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
    get(key: string, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");

        const data: any = this.loadYamlFromFile();

        if (!data) return undefined;

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentValue: any = data;

            for (const part of keyParts) {
                if (!currentValue.hasOwnProperty(part)) return undefined;
                currentValue = currentValue[part];
            }

            return currentValue;
        } else {
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
    fetch(key: string, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        return this.get(key, nestedEnabled, separator);
    }

    /**
     * Deletes a value from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - True if deleted, false if not found.
     */
    delete(key: string, nestedEnabled: Boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");

        const data: any = this.loadYamlFromFile();
        if (!data) return false;

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            let currentObject: any = data;

            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part]) return false;
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            if (lastPart in currentObject) {
                delete currentObject[lastPart];
                this.saveYamlToFile(data);
                return true;
            } else {
                return false;
            }
        } else {
            if (key in data) {
                delete data[key];
                this.saveYamlToFile(data);
                return true;
            } else {
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
    has(key: string, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator): boolean {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        if (this.get(key, nestedEnabled, separator)) return true;
        else return false;
    }

    /**
     * Adds a value to the existing value in the database.
     * @param {string} key - Key to add to.
     * @param {number} value - Value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     */
    add(key: string, value: number, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        const currentValue = this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue != 'number') throw new DatabaseError(`Cannot push to a non-number value at key '${key}'`);
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
    subtract(key: string, value: number, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        let currentValue = this.get(key, nestedEnabled, separator) || 0;
        if (typeof currentValue == 'string') throw new DatabaseError(`Cannot push to a non-number value at key '${key}'`);

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
    push(key: string, value: any, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        const array = this.get(key, nestedEnabled, separator) || [];
        if (!Array.isArray(array)) throw new DatabaseError(`Cannot push to a non-array value at key '${key}'`);

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
    pull(key: string, callbackOrValue: any, pullAll: boolean = false, nestedEnabled: boolean = this.nestedEnabled, separator: string = this.separator) {
        if (!key) throw new DatabaseError("The key is not defined!");

        const data: any = this.loadYamlFromFile();
        if (!data) return false;

        const traverseAndPull = (currentObject: any, keyParts: string[], depth: number): boolean => {
            const part = keyParts[depth];

            if (depth === keyParts.length - 1) {
                if (!currentObject.hasOwnProperty(part) || !Array.isArray(currentObject[part])) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }

                const array = currentObject[part];
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
                    this.saveYamlToFile(data);
                }
                return removed;
            } else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }

                const updated = traverseAndPull(currentObject[part], keyParts, depth + 1);

                if (updated) this.saveYamlToFile(data);
                return updated;
            }
        };

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            return traverseAndPull(data, keyParts, 0);
        } else {
            if (!Array.isArray(data)) {
                throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
            }

            const array = data;
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
                array.forEach((element: any, index: number) => {
                    if (!removed) {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;
                            if (callback(element, index, array)) {
                                array.splice(index, 1);
                                removed = true;
                            }
                        } else {
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
    all(type: number = 0) {
        if (type == 0) {
            const data: any = this.loadYamlFromFile();
            const keys = Object.keys(data);
            const result = [];

            for (const key of keys) {
                result.push({ ID: key, data: data[key] });
            }

            return result;
        } else if (type == 1) {
            const data: any = this.loadYamlFromFile();
            return data;
        }else {
            throw new DatabaseError("Invalid type, type must be 0 or 1");
        }
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
    createSnapshot(snapshotName: string) {
        if (!snapshotName) throw new DatabaseError("The snapshotName is required!");

        const data = this.loadYamlFromFile();
        const snapshotsFile = 'snapshots.yaml'; // Name of the snapshot file
        const snapshotsData: any = fs.existsSync(snapshotsFile)
            ? yaml.load(fs.readFileSync(snapshotsFile, 'utf8'))
            : [];

        const existingSnapshot = snapshotsData.find((snapshot: { name: string, timestamp: DateConstructor, data: object }) => snapshot.name === snapshotName);
        if (existingSnapshot) throw new DatabaseError("Snapshot with the same name already exists.");

        snapshotsData.push({ name: snapshotName, timestamp: new Date(), data: data });

        fs.writeFileSync(snapshotsFile, yaml.dump(snapshotsData, { indent: 2 }));
    }

    /**
     * Roll back the database to a specific snapshot's state.
     * @param {string} snapshotName - The name of the snapshot to roll back to.
     * @throws {DatabaseError} If the specified snapshot is not found.
     * @example
     * db.rollbackToSnapshot('backup1');
     */
    rollbackToSnapshot(snapshotName: string) {
        if (!snapshotName) throw new DatabaseError("The snapshotName is required!");

        const snapshotsFile = 'snapshots.yaml';
        const snapshotsData: any = fs.existsSync(snapshotsFile)
            ? yaml.load(fs.readFileSync(snapshotsFile, 'utf8'))
            : [];

        const snapshot = snapshotsData.find((snapshot: { name: string, timestamp: DateConstructor, data: object }) => snapshot.name === snapshotName);
        if (snapshot) {
            this.saveYamlToFile(snapshot.data);
        } else {
            throw new DatabaseError("Snapshot not found.");
        }
    }


}
