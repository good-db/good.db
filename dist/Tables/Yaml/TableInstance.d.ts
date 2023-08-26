import BaseYAMLInstance from '../../drivers/YAML/BaseYAMLInstance';
export default class TableInstance extends BaseYAMLInstance {
    constructor(filePath: string, tableName: string, nestedEnabled?: boolean, separator?: string);
}
