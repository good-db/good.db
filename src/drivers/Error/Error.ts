const green = (message: String) => `\x1b[32m${message}\x1b[0m`;

const red = (message: String) => `\x1b[31m${message}\x1b[0m`;

const yellow = (message: String) => `\x1b[33m${message}\x1b[0m`;

const advertisement = `${yellow("[ Good.db ] => Information:")} ${green("Come here for help => https://discord.gg/qcBA2rv9gc")}`;

export default class DatabaseError extends Error {
    constructor(message: String) {
        super(`${red(message)}\n${advertisement}`);
    }

    get name() {
        return yellow(`[ Good.db ] => ${this.constructor.name}`);
    }
}