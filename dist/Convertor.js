"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const good_db_1 = __importDefault(require("./good.db"));
const ErrorMessage_1 = require("./utils/ErrorMessage");
const Utils_1 = require("./utils/Utils");
class Convertor {
    constructor(options) {
        this.from = {
            driver: options.from,
            isAsync: (0, Utils_1.checkDriverIsAsync)(options.from)
        };
        this.to = {
            driver: options.to,
            isAsync: (0, Utils_1.checkDriverIsAsync)(options.to)
        };
        this.table = options.table;
        if (!this.table) {
            throw new ErrorMessage_1.DatabaseError('Table name is required');
        }
        ;
        if (this.from == this.to) {
            throw new ErrorMessage_1.DatabaseError('Cannot convert to the same driver');
        }
        ;
    }
    ;
    convert() {
        return __awaiter(this, void 0, void 0, function* () {
            let fromData = [];
            let fromGoodDB = new good_db_1.default(this.from.driver);
            if (fromGoodDB.isAsync)
                yield fromGoodDB.connect();
            // Assuming this.table is defined somewhere in your class
            if (this.table !== 'all_tables') {
                const data = yield (yield fromGoodDB.table(this.table)).all('array');
                fromData.push({
                    table: this.table,
                    data: data,
                });
            }
            else if (this.table === 'all_tables') {
                const tables = yield this.from.driver.tables();
                for (let table of tables) {
                    const tableData = yield (yield fromGoodDB.table(table)).all('array');
                    fromData.push({
                        table: table,
                        data: tableData,
                    });
                }
                ;
            }
            ;
            let toGoodDB = new good_db_1.default(this.to.driver);
            if (toGoodDB.isAsync)
                yield toGoodDB.connect();
            const totalRows = fromData.reduce((acc, curr) => acc + curr.data.length, 0);
            let completedRows = 0;
            for (let data of fromData) {
                const table = data.table;
                const rows = data.data;
                yield this.to.driver.insert(table, rows);
                completedRows += rows.length;
                this.updateProgressBar(Math.floor((completedRows / totalRows) * 100));
            }
            ;
            return true;
        });
    }
    ;
    updateProgressBar(progress) {
        const progressBarLength = 50;
        const completedChars = Math.floor(progressBarLength * (progress / 100));
        const remainingChars = progressBarLength - completedChars;
        const progressBar = '[' + '='.repeat(completedChars) + '>'.repeat(progress < 100 ? 1 : 0) + ' '.repeat(remainingChars) + ']';
        console.clear();
        console.log('Conversion Progress: ' + progressBar + ' ' + progress + '%');
    }
}
exports.default = Convertor;
;
//# sourceMappingURL=Convertor.js.map