export default class DatabaseError extends Error {
    constructor(message: String);
    get name(): string;
}
