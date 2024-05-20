"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDriverIsAsync = void 0;
const __1 = require("..");
const checkDriverIsAsync = (driver) => {
    return driver instanceof __1.MongoDBDriver || driver instanceof __1.PostgreSQLDriver || driver instanceof __1.MySQLDriver ? true : false;
};
exports.checkDriverIsAsync = checkDriverIsAsync;
//# sourceMappingURL=Utils.js.map