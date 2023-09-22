"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseSQLITE = exports.YAMLTable = exports.DataBaseYAML = exports.JSONTable = exports.DataBaseJSON = void 0;
// Create Json database
const DataBaseJSON_1 = __importDefault(require("./drivers/JSON/DataBaseJSON"));
exports.DataBaseJSON = DataBaseJSON_1.default;
// Create Yaml database
const DataBaseYAML_1 = __importDefault(require("./drivers/YAML/DataBaseYAML"));
exports.DataBaseYAML = DataBaseYAML_1.default;
// Create Sqlite database
const DataBaseSQLITE_1 = __importDefault(require("./drivers/SQLITE/DataBaseSQLITE"));
exports.DataBaseSQLITE = DataBaseSQLITE_1.default;
// Create Json table
const Main_1 = __importDefault(require("./Tables/Json/Main"));
exports.JSONTable = Main_1.default;
// Create Yaml table
const Main_2 = __importDefault(require("./Tables/Yaml/Main"));
exports.YAMLTable = Main_2.default;
