// Create Json database
import DataBaseJSON from "./drivers/JSON/DataBaseJSON";
// Create Yaml database
import DataBaseYAML from "./drivers/YAML/DataBaseYAML";
// Create Sqlite database
import DataBaseSQLITE from './drivers/SQLITE/DataBaseSQLITE';
// Create Json table
import JSONTable from "./Tables/Json/Main";
// Create Yaml table
import YAMLTable from "./Tables/Yaml/Main";

export { DataBaseJSON, JSONTable, DataBaseYAML, YAMLTable, DataBaseSQLITE };