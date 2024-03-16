export type goodDBOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
    table?: string;
    timeIsEnabled?: boolean;
};
export type JSONDriverOptions = {
    path?: string;
    format?: boolean;
};
export type methodOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
};
export interface MongoDBDriverOptions {
    uri: string;
    database?: string;
}
export type SQLiteDriverOptions = {
    path?: string;
};
export type YMLDriverOptions = {
    path?: string;
};
