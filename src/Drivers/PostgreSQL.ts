import { Pool, PoolConfig } from 'pg';
// import { PostgreSQLDriverOptions } from '../Types';

export class PostgreSQLDriver {
  private pool: Pool;

  constructor(public readonly options: PoolConfig) {
    this.pool = new Pool(options);
  };

  public async init(table: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS ${table} (key TEXT PRIMARY KEY, value JSONB)`);
      return true;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  // Inserters/Updaters
  public async setRowByKey(table: string, key: string, value: any): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query(`INSERT INTO ${table} (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`, [key, JSON.stringify(value)]);
      return true;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Getters
  public async getAllRows(table: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(`SELECT key, value FROM ${table}`);
      const data: any = {};
      rows.forEach((row: {
        key: string;
        value: any;
      }) => {
        data[row.key] = row.value;
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  public async getRowByKey(table: string, key: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(`SELECT value FROM ${table} WHERE key = $1`, [key]);
      if (rows.length === 0) return null;
      return rows[0].value;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Deleters
  public async deleteRowByKey(table: string, key: string): Promise<number | null> {
    const client = await this.pool.connect();
    try {
      const { rowCount } = await client.query(`DELETE FROM ${table} WHERE key = $1`, [key]);
      return rowCount;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  public async deleteAllRows(table: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query(`TRUNCATE TABLE ${table}`);
      return true;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<boolean> {
    await this.pool.end();

    return true;
  }
}