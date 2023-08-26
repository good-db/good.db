import BaseJSONInstance from '../../drivers/JSON/BaseJsonInstance';
export default class TableInstance extends BaseJSONInstance {
    constructor(filePath: string, tableName: string, nestedEnabled?: boolean, separator?: string);
}
