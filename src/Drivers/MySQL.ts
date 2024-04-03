import mysql, { Pool, PoolOptions } from 'mysql2/promise';

export class MySQLDriver {
    private pool: Pool;

    constructor(public readonly options: PoolOptions) {
        this.pool = mysql.createPool(options);
    }

    public async init(table: string): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (\`key\` VARCHAR(255) PRIMARY KEY, \`value\` TEXT)`);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // Inserters/Updaters
    public async setRowByKey(table: string, key: string, value: any): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            const valueString = JSON.stringify(value);
            await connection.query(`INSERT INTO \`${table}\` (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?`, [key, valueString, valueString]);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }


    // Getters
    public async getAllRows(table: string): Promise<any> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT \`key\`, \`value\` FROM \`${table}\``) as any[];
            const data: any = {};
            rows.forEach((row: { key: string; value: any }) => {
                data[row.key] = JSON.parse(row.value);
            });
            return data;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    public async getRowByKey(table: string, key: string): Promise<any> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT \`value\` FROM \`${table}\` WHERE \`key\` = ?`, [key]) as any[];

            if (rows.length === 0) return null;
            return JSON.parse(rows[0].value);
        } catch (error) {
            throw error;
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
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    public async deleteAllRows(table: string): Promise<boolean> {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(`TRUNCATE TABLE \`${table}\``);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    public async close(): Promise<boolean> {
        await this.pool.end();
        return true;
    }
};