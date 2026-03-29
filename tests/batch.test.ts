import { GoodDB, JSONDriver } from "../src";
import fs from 'fs';

describe('Batch Operations (without nested)', () => {
    let db: any;
    beforeAll(() => {
        db = new GoodDB(new JSONDriver({
            path: "./tests/batch_db.json"
        }), {
            nestedIsEnabled: false
        });
    });

    afterAll(() => {
        if (fs.existsSync('./tests/batch_db.json')) {
            fs.unlinkSync('./tests/batch_db.json');
        }
    });

    test('setMany method', () => {
        db.setMany({ key1: 'value1', key2: 'value2', key3: 123 });
        expect(db.get('key1')).toBe('value1');
        expect(db.get('key2')).toBe('value2');
        expect(db.get('key3')).toBe(123);
    });

    test('getMany method', () => {
        const result = db.getMany(['key1', 'key2', 'key3']);
        expect(result).toEqual({
            key1: 'value1',
            key2: 'value2',
            key3: 123
        });
    });

    test('deleteMany method', () => {
        db.deleteMany(['key1', 'key2']);
        expect(db.get('key1')).toBeUndefined();
        expect(db.get('key2')).toBeUndefined();
        expect(db.get('key3')).toBe(123);
    });

    test('findAndUpdateMany method', () => {
        db.set('users', [
            { id: 1, name: 'Alice', active: true },
            { id: 2, name: 'Bob', active: true },
            { id: 3, name: 'Charlie', active: false },
        ]);
        const updated = db.findAndUpdateMany('users',
            (user: any) => user.active === true,
            (user: any) => { user.status = 'verified'; return user; }
        );
        expect(updated.length).toBe(2);
        expect(updated[0].status).toBe('verified');
        expect(updated[1].status).toBe('verified');
        const users = db.get('users');
        expect(users[0].status).toBe('verified');
        expect(users[1].status).toBe('verified');
        expect(users[2].status).toBeUndefined();
    });

    test('findAndUpdateMany with no matches', () => {
        const result = db.findAndUpdateMany('users',
            (user: any) => user.name === 'NonExistent',
            (user: any) => user
        );
        expect(result).toEqual([]);
    });
});

describe('Batch Operations (with nested)', () => {
    let db: any;
    beforeAll(() => {
        db = new GoodDB(new JSONDriver({
            path: "./tests/batch_nested_db.json"
        }), {
            nestedIsEnabled: true,
            nested: '..'
        });
    });

    afterAll(() => {
        if (fs.existsSync('./tests/batch_nested_db.json')) {
            fs.unlinkSync('./tests/batch_nested_db.json');
        }
    });

    test('setMany with nested paths', () => {
        db.set('data', {});
        db.setMany({ 'data..key1': 'value1', 'data..key2': 'value2' });
        expect(db.get('data..key1')).toBe('value1');
        expect(db.get('data..key2')).toBe('value2');
    });

    test('getMany with nested paths', () => {
        const result = db.getMany(['data..key1', 'data..key2']);
        expect(result).toEqual({
            'data..key1': 'value1',
            'data..key2': 'value2'
        });
    });

    test('deleteMany with nested paths', () => {
        db.deleteMany(['data..key1', 'data..key2']);
        expect(db.get('data..key1')).toBeUndefined();
        expect(db.get('data..key2')).toBeUndefined();
    });

    test('findAndUpdateMany with nested paths', () => {
        db.set('data..users', [
            { id: 1, name: 'Alice', active: true },
            { id: 2, name: 'Bob', active: true },
            { id: 3, name: 'Charlie', active: false },
        ]);
        const updated = db.findAndUpdateMany('data..users',
            (user: any) => user.active === true,
            (user: any) => { user.status = 'verified'; return user; }
        );
        expect(updated.length).toBe(2);
        const users = db.get('data..users');
        expect(users[0].status).toBe('verified');
        expect(users[1].status).toBe('verified');
        expect(users[2].status).toBeUndefined();
    });
});
