import GoodDB from "./good.db";
import { Drivers } from "./Types";
import { DatabaseError } from "./utils/ErrorMessage";
import { checkDriverIsAsync } from "./utils/Utils";


export default class Convertor {
    from: {
        driver: Drivers,
        isAsync: boolean,
    };
    to: {
        driver: Drivers,
        isAsync: boolean,
    };
    table: string;

    constructor(options: {
        from: Drivers,
        to: Drivers,
        table: string | 'all_tables',
    }) {
        this.from = {
            driver: options.from,
            isAsync: checkDriverIsAsync(options.from)
        };
        this.to = {
            driver: options.to,
            isAsync: checkDriverIsAsync(options.to)
        };

        this.table = options.table;

        if (!this.table) {
            throw new DatabaseError('Table name is required');
        };

        if (this.from == this.to) {
            throw new DatabaseError('Cannot convert to the same driver');
        };
    };

    async convert(): Promise<boolean> {
        let fromData: {
            table: string,
            data: any,
        }[] = [];
        let fromGoodDB = new GoodDB(this.from.driver);

        if (fromGoodDB.isAsync)
            await fromGoodDB.connect();

        // Assuming this.table is defined somewhere in your class
        if (this.table !== 'all_tables') {
            const data = await (await fromGoodDB.table(this.table)).all('array');
            fromData.push({
                table: this.table,
                data: data,
            });
        } else if (this.table === 'all_tables') {

            const tables = await this.from.driver.tables();

            for (let table of tables) {
                const tableData = await (await fromGoodDB.table(table)).all('array');
                fromData.push({
                    table: table,
                    data: tableData,
                });
            };
        };

        let toGoodDB = new GoodDB(this.to.driver);


        if (toGoodDB.isAsync)
            await toGoodDB.connect();

        const totalRows = fromData.reduce((acc, curr) => acc + curr.data.length, 0);
        let completedRows = 0;

        for (let data of fromData) {
            const table = data.table;
            const rows = data.data;

            await this.to.driver.insert(table, rows);
            completedRows += rows.length;
            this.updateProgressBar(Math.floor((completedRows / totalRows) * 100));
        };

        return true;
    };

    updateProgressBar(progress: number) {
        const progressBarLength = 50;
        const completedChars = Math.floor(progressBarLength * (progress / 100));
        const remainingChars = progressBarLength - completedChars;

        const progressBar = '[' + '='.repeat(completedChars) + '>'.repeat(progress < 100 ? 1 : 0) + ' '.repeat(remainingChars) + ']';

        console.clear();
        console.log('Conversion Progress: ' + progressBar + ' ' + progress + '%');
    }
};