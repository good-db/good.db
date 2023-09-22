"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const green = (message) => `\x1b[32m${message}\x1b[0m`;
const red = (message) => `\x1b[31m${message}\x1b[0m`;
const yellow = (message) => `\x1b[33m${message}\x1b[0m`;
const advertisement = `${yellow("[ Good.db ] => Information:")} ${green("Come here for help => https://discord.gg/qcBA2rv9gc")}`;
class DatabaseError extends Error {
    constructor(message) {
        super(`${red(message)}\n${advertisement}`);
    }
    get name() {
        return yellow(`[ Good.db ] => ${this.constructor.name}`);
    }
}
exports.default = DatabaseError;
