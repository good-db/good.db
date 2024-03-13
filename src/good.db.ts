import { CacheDriver } from "./Drivers/Cache";
import { JSONDriver } from "./Drivers/JSON";
import { MongoDBDriver } from "./Drivers/Mongo";
import { SQLiteDriver } from "./Drivers/SQLite";
import { YMLDriver } from "./Drivers/YML";
import { goodDBOptions, methodOptions } from "./Types";
import { DatabaseError } from "./utils/ErrorMessage";
import { deleteValueAtPath, getValueAtPath, setValueAtPath } from "./utils/nested";

export default class GoodDB {
    driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver;
    nested: {
        nested: string;
        isEnabled: boolean;
    };
    isAsync: boolean;

    constructor(
        driver: JSONDriver | SQLiteDriver | YMLDriver | CacheDriver | MongoDBDriver,
        options?: goodDBOptions
    ) {
        this.driver = driver;
        this.nested = {
            nested: options?.nested || '..',
            isEnabled: options?.nestedIsEnabled ? true : false,
        };
        this.isAsync = this.driver instanceof MongoDBDriver ? true : false;
        this.driver.init();
    };

    public async set(key: string, value: any, options?: methodOptions): Promise<boolean>;
    public set(key: string, value: any, options?: methodOptions): boolean;
    public set(key: string, value: any, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };

        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const newData = setValueAtPath(this.driver.read(), key, value, {
                            separator: options?.nested,
                        });

                        await this.driver.write(newData);

                        resolve(true);
                    } else {
                        const data = await this.driver.read();
                        data[key] = value;
                        await this.driver.write(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nested) {
                const newData = setValueAtPath(this.driver.read(), key, value, {
                    separator: this.nested.nested,
                });

                this.driver.write(newData);

                return true;
            } else {
                const data = this.driver.read();
                data[key] = value;
                this.driver.write(data);
                return true;
            }
        }
    };

    public async get(key: string, options?: methodOptions): Promise<any>;
    public get(key: string, options?: methodOptions): any;
    public get(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const data = getValueAtPath(await this.driver.read(), key, {
                            separator: this.nested.nested,
                        });
                        return resolve(data);
                    } else {
                        const data = await this.driver.read();
                        return resolve(data[key]);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                return getValueAtPath(this.driver.read(), key, {
                    separator: this.nested.nested,
                });
            } else {
                return this.driver.read()[key];
            }
        }
    };

    public async has(key: string, options?: methodOptions): Promise<boolean>;
    public has(key: string, options?: methodOptions): boolean;
    public has(key: string, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const value = await this.get(key, options);
                    resolve(value !== null && value !== undefined);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return this.get(key, options) as any ? true : false;
        }
    };

    public async math(key: string, mathSign: string, value: number, options?: methodOptions): Promise<number>;
    public math(key: string, mathSign: string, value: number, options?: methodOptions): number;
    public math(key: string, mathSign: string, value: number, options?: methodOptions): number | Promise<number> {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };

        if (this.isAsync) {
            return new Promise((resolve, reject) => {
                try {
                    let data: any = this.get(key, options);

                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }

                    switch (mathSign) {
                        case '+':
                            data = (data || 0) + value;
                            break;
                        case '-':
                            data = (data || 0) - value;
                            break;
                        case '*':
                        case '×':
                            data = (data || 1) * value;
                            break;
                        case '/':
                            if (value === 0) {
                                throw new DatabaseError('Cannot divide by zero');
                            }
                            data = (data || 0) / value;
                            break;
                        default:
                            throw new DatabaseError('Invalid math sign');
                    }

                    this.set(key, data, options)
                        .then(() => resolve(data))
                        .catch((error) => reject(error));
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            try {
                let data: any = this.get(key, options);

                if (typeof data !== 'number' && data !== undefined) {
                    throw new DatabaseError('Value is not a number');
                }

                switch (mathSign) {
                    case '+':
                        data = (data || 0) + value;
                        break;
                    case '-':
                        data = (data || 0) - value;
                        break;
                    case '*':
                    case '×':
                        data = (data || 1) * value;
                        break;
                    case '/':
                        if (value === 0) {
                            throw new DatabaseError('Cannot divide by zero');
                        }
                        data = (data || 0) / value;
                        break;
                    default:
                        throw new DatabaseError('Invalid math sign');
                }

                this.set(key, data, options);
                return data;
            } catch (error) {
                throw error;
            }
        }
    };

    public async startsWith(key: string, options?: methodOptions): Promise<any>;
    public startsWith(key: string, options?: methodOptions): any;
    public startsWith(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                        const data: any = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new DatabaseError('Value is not an object');
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    } else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result: any = {};
                        for (const k of keys) {
                            if (k.startsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                const data: any = this.get(k, options);

                if (typeof data !== 'object') {
                    throw new DatabaseError('Value is not an object');
                };
                const keys: string[] = Object.keys(data);

                const result: any = {};
                for (const k of keys) {
                    if (k.startsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            } else {
                const data = this.driver.read();
                const keys = Object.keys(data);
                const result: any = {};
                for (const k of keys) {
                    if (k.startsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
        }
    };

    public async endsWith(key: string, options?: methodOptions): Promise<any>;
    public endsWith(key: string, options?: methodOptions): any;
    public endsWith(key: string, options?: methodOptions): Promise<any> | any {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                        const data: any = await this.get(k, options);
                        if (typeof data !== 'object') {
                            throw new DatabaseError('Value is not an object');
                        };
                        const keys: string[] = Object.keys(data);

                        const result: any = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    } else {
                        const data = await this.driver.read();
                        const keys = Object.keys(data);
                        const result: any = {};
                        for (const k of keys) {
                            if (k.endsWith(key)) {
                                result[k] = data[k];
                            }
                        }
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const k = key.split(options?.nested as string).slice(0, -1).join(options?.nested as string);
                const data: any = this.get(k, options);
                if (typeof data !== 'object') {
                    throw new DatabaseError('Value is not an object');
                };
                const keys: string[] = Object.keys(data);

                const result: any = {};
                for (const k of keys) {
                    if (k.endsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            } else {
                const data = this.driver.read();
                const keys = Object.keys(data);
                const result: any = {};
                for (const k of keys) {
                    if (k.endsWith(key)) {
                        result[k] = data[k];
                    }
                }
                return result;
            }
        }
    };

    public async push(key: string, value: any, options?: methodOptions): Promise<number>;
    public push(key: string, value: any, options?: methodOptions): number;
    public push(key: string, value: any, options?: methodOptions): Promise<number> | number {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (!Array.isArray(data) && data !== undefined) {
                        throw new DatabaseError('Value is not an array');
                    }
                    if (data === undefined) {
                        this.set(key, [value], options);
                        resolve(1);
                    }
                    data.push(value);
                    await this.set(key, data, options);
                    resolve(data.length);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.get(key, options);
            if (!Array.isArray(data) && data !== undefined) {
                throw new DatabaseError('Value is not an array');
            }
            if (data === undefined) {
                this.set(key, [value], options);
                return 1;
            }
            data.push(value);
            this.set(key, data, options);
            return data.length;
        }
    };

    public async pull(key: string, valueOrCallback: (e: any, i: number, a: any) => any | number | string | boolean | number | undefined | null, pullAll?: boolean, options?: methodOptions): Promise<boolean>;
    public pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): boolean;
    public pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (!key) {
            throw new DatabaseError("The key is not defined!");
        }
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data: any = await this.get(key);
                    console.log(data, 'aadada');
                    
                    if (!data) {
                        resolve(false);
                    }
                    

                    const pullFromArray = async (array: any[]): Promise<boolean> => {
                        const indexesToRemove: number[] = [];

                        let removed = false;
                        array.forEach((element: any, index: number) => {
                            if (!removed && !pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                } else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                    removed = true;
                                }
                            } else if (pullAll) {
                                if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                                    indexesToRemove.push(index);
                                } else if (element === valueOrCallback) {
                                    indexesToRemove.push(index);
                                }
                            }
                        });

                        if (indexesToRemove.length > 0) {
                            for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                                array.splice(indexesToRemove[i], 1);
                            }
                            await this.set(key, data, options);
                            return true;
                        } else {
                            return false;
                        }
                    };

                    const pullFromNestedObject = async (currentObject: any, keyParts: string[], depth: number): Promise<boolean> => {
                        const part = keyParts[depth];

                        if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                            throw new DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                        }

                        if (depth === keyParts.slice(1).length) {
                            return await pullFromArray(currentObject[part]);
                        } else {
                            const updated = await pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                            if (updated) {
                                await this.set(key, data, options);
                            }
                            return updated;
                        }
                    }

                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const keyParts = key.split(options.nested as string);
                        await pullFromNestedObject(data, keyParts, 0);
                        resolve(true);
                    } else {
                        if (!Array.isArray(data)) {
                            throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                        }
                        await pullFromArray(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data: any = this.get(key);
            if (!data) {
                return false;
            }

            const pullFromArray = (array: any[]): boolean => {
                const indexesToRemove: number[] = [];

                let removed = false;
                array.forEach((element: any, index: number) => {
                    if (!removed && !pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                            removed = true;
                        } else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                            removed = true;
                        }
                    } else if (pullAll) {
                        if (typeof valueOrCallback === 'function' && valueOrCallback(element, index, array)) {
                            indexesToRemove.push(index);
                        } else if (element === valueOrCallback) {
                            indexesToRemove.push(index);
                        }
                    }
                });

                if (indexesToRemove.length > 0) {
                    for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                        array.splice(indexesToRemove[i], 1);
                    }
                    this.set(key, data, options);
                    return true;
                }
                return false;
            };


            const pullFromNestedObject = (currentObject: any, keyParts: string[], depth: number): boolean => {
                const part = keyParts[depth];

                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot pull from a non-object or non-array value at key '${key}'`);
                }

                if (depth === keyParts.slice(1).length) {
                    return pullFromArray(currentObject[part]);
                } else {
                    const updated = pullFromNestedObject(currentObject[part], keyParts, depth + 1);
                    if (updated) {
                        this.set(key, data, options);
                    }
                    return updated;
                }
            };

            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const keyParts = key.split(options.nested as string);
                return pullFromNestedObject(data, keyParts, 0);
            } else {
                if (!Array.isArray(data)) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }
                return pullFromArray(data);
            }
        }
    };

    public async add(key: string, value: number, options?: methodOptions): Promise<number>;
    public add(key: string, value: number, options?: methodOptions): number;
    public add(key: string, value: number, options?: methodOptions): Promise<number> | number {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) + value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) + value;
            this.set(key, newValue, options);
            return newValue;
        }
    };

    public async subtract(key: string, value: number, options?: methodOptions): Promise<number>;
    public subtract(key: string, value: number, options?: methodOptions): number;
    public subtract(key: string, value: number, options?: methodOptions): Promise<number> | number {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.get(key, options);
                    if (typeof data !== 'number' && data !== undefined) {
                        throw new DatabaseError('Value is not a number');
                    }
                    const newValue = (data || 0) - value;
                    await this.set(key, newValue, options);
                    resolve(newValue);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            const data = this.get(key, options);
            if (typeof data !== 'number' && data !== undefined) {
                throw new DatabaseError('Value is not a number');
            }
            const newValue = (data || 0) - value;
            this.set(key, newValue, options);
            return newValue;
        }
    };

    public async delete(key: string, options: methodOptions): Promise<boolean>;
    public delete(key: string, options?: methodOptions): boolean;
    public delete(key: string, options?: methodOptions): Promise<boolean> | boolean {
        options = options || {
            nested: this.nested.nested,
            nestedIsEnabled: this.nested.isEnabled
        };
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                        const data = deleteValueAtPath(this.driver.read(), key, {
                            separator: options?.nested,
                        });

                        await this.driver.write(data);

                        resolve(true);
                    } else {
                        const data = await this.driver.read();
                        delete data[key];
                        await this.driver.write(data);
                        resolve(true);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            if (options?.nestedIsEnabled && key.includes(options?.nested as string)) {
                const data = deleteValueAtPath(this.driver.read(), key, {
                    separator: options?.nested,
                });

                this.driver.write(data);

                return true;
            } else {
                const data = this.driver.read();
                delete data[key];
                this.driver.write(data);
                return true;
            }
        }
    };

    public async all(): Promise<any>;
    public all(): any;
    public all(): Promise<any> | any {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await this.driver.read();
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return this.driver.read();
        }
    };

    public async clear(): Promise<boolean>;
    public clear(): boolean;
    public clear(): Promise<boolean> | boolean {
        if (this.isAsync) {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.driver.clear();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            this.driver.clear();
            return true;
        }
    };
};