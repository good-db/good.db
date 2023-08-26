import BaseJSONInstance from '../BaseJsonInstance';
export default class TableInstance extends BaseJSONInstance {
    #private;
    constructor(filePath: string, tableName: string, nestedEnabled?: boolean, separator?: string);
}
