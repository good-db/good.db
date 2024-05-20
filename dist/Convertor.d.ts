import { Drivers } from "./Types";
export default class Convertor {
    from: {
        driver: Drivers;
        isAsync: boolean;
    };
    to: {
        driver: Drivers;
        isAsync: boolean;
    };
    table: string;
    constructor(options: {
        from: Drivers;
        to: Drivers;
        table: string | 'all_tables';
    });
    convert(): Promise<boolean>;
    updateProgressBar(progress: number): void;
}
