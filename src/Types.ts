export type goodDBOptions = {
    // nested
    nested?: string;
    nestedIsEnabled?: boolean;
    table?: string;

    // database
    timeIsEnabled?: boolean;
    cache?: {
        isEnabled?: boolean;
        capacity?: number;
    };
};

export type JSONDriverOptions = {
    // nested
    path?: string;
    format?: boolean;
};

export type methodOptions = {
    // nested
    nested?: string;
    nestedIsEnabled?: boolean;
};

// export type MySQLDriverOptions = {
//     host: string; // MySQL server host
//     user: string; // MySQL username
//     password: string; // MySQL password
//     database: string; // MySQL database name
//     port?: number | string; // MySQL server port (optional, default is 3306)
// };

export interface MongoDBDriverOptions {
    uri: string; // MongoDB connection URI
    database?: string; // MongoDB database name
};

export type SQLiteDriverOptions = {
    path?: string;
};

export type YMLDriverOptions = {
    path?: string;
};

export type MathSigns = '+' | '-' | '*' | '×' | '/';