import { MongoDBDriver, MySQLDriver, PostgreSQLDriver } from "..";
import { Drivers } from "../Types";

export const checkDriverIsAsync = (driver: Drivers) => {
    return driver instanceof MongoDBDriver || driver instanceof PostgreSQLDriver || driver instanceof MySQLDriver ? true : false;
};