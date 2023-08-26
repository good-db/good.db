import BaseYAMLInstance from '../BaseYAMLInstance';
export default class TableInstance extends BaseYAMLInstance {
    #private;
    constructor(filePath: string, tableName: string, nestedEnabled?: boolean, separator?: string);
}
