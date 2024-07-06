import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { DatabaseDesignArray, DriversClassType } from '../Types';

export class MySQLDriver implements DriversClassType {
    public readonly pool: Pool;

    constructor(public readonly options: PoolOptions) {
        this.pool = mysql.createPool(options);
    }

    public async init(table: string): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (\`key\` VARCHAR(255) PRIMARY KEY, \`value\` TEXT)`);
            return true;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };
    
    public async createTable(table: string): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (\`key\` VARCHAR(255) PRIMARY KEY, \`value\` TEXT)`);
            return true;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };

    public async tables(): Promise<string[]> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query('SHOW TABLES') as any[];
            return rows.map((row: any) => row[`Tables_in_${this.options.database}`]);
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };

    // Inserters/Updaters
    public async insert(table: string, value: DatabaseDesignArray): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            const values = value.map(({ key, value }) => `('${key}', '${JSON.stringify(value)}')`).join(', ');
            await connection.query(`INSERT INTO \`${table}\` (\`key\`, \`value\`) VALUES ${values} ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`);

            return true;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };

    public async setRowByKey(table: string, key: string, value: any): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            const valueString = JSON.stringify(value);
            await connection.query(`INSERT INTO \`${table}\` (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?`, [key, valueString, valueString]);
            return true;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };


    // Getters
    public async getAllRows(table: string): Promise<[any, boolean]> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT \`key\`, \`value\` FROM \`${table}\``) as any[];
            return [rows, false];
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    };

    public async getRowByKey(table: string, key: string): Promise<any> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT \`value\` FROM \`${table}\` WHERE \`key\` = ?`, [key]) as any[];

            if (rows.length === 0) return undefined;
            return JSON.parse(rows[0].value);
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    }

    // Deleters
    public async deleteRowByKey(table: string, key: string): Promise<number | null> {
        const connection = await this.pool.getConnection();
        try {
            const [{ affectedRows }] = await connection.query(`DELETE FROM \`${table}\` WHERE \`key\` = ?`, [key]) as any[];
            return affectedRows;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    }

    public async deleteAllRows(table: string): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(`TRUNCATE TABLE \`${table}\``);
            return true;
        } catch (error: any) {
            throw new Error(error);
        } finally {
            connection.release();
        }
    }

    public async close(): Promise<boolean> {
        await this.pool.end();
        return true;
    }
};