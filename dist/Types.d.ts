export type goodDBOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
    timeIsEnabled?: boolean;
};
export type JSONDriverOptions = {
    path?: string;
};
export type methodOptions = {
    nested?: string;
    nestedIsEnabled?: boolean;
};
export interface MongoDBDriverOptions {
    uri: string;
    database?: string;
}
