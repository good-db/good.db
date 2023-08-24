import fs from 'fs';
import BaseJSONInstance from '../BaseJsonInstance';

export default class TableInstance extends BaseJSONInstance {
    #tableName: string;
    constructor(filePath: string, tableName: string, nestedEnabled: boolean = true, separator: string = '..') {
        super(`${filePath}/${tableName}.json`, nestedEnabled, separator);
        this.#tableName = tableName;
    }
}