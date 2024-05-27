import { GoodDB, JSONDriver, SQLiteDriver } from "../src";
import fs from 'fs';

describe('JSON Driver without nested', () => {
    let db: any;
    beforeAll(() => {
        db = new GoodDB(new JSONDriver({
            path: "./tests/db.json"
        }), {
            nestedIsEnabled: false
        });
    });

    afterAll(() => {
        fs.unlinkSync('./tests/db.json');
    });

    test('Set method', () => {
        db.set('users', [{ name: 'Alice', age: 25 }]);
        expect(db.get('users')).toEqual([{ name: 'Alice', age: 25 }]);
    });

    test('Get method', () => {
        expect(db.get('users')).toEqual([{ name: 'Alice', age: 25 }]);
    });

    test('Delete method', () => {
        db.delete('users');
        expect(db.get('users')).toBeUndefined();
    });

    test('Push method', () => {
        db.push('users', { name: 'Alice', age: 25 });
        db.push('users', { name: 'Bob', age: 30 });
        db.push('users', { name: 'Charlie', age: 35 });
        expect(db.get('users')).toEqual([
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
            { name: 'Charlie', age: 35 }
        ]);
    });

    test('Shift method', () => {
        db.shift('users');
        expect(db.get('users')).toEqual([
            { name: 'Bob', age: 30 },
            { name: 'Charlie', age: 35 }
        ]);
    });

    test('Unshift method', () => {
        db.unshift('users', { name: 'Alice', age: 25 });
        expect(db.get('users')).toEqual([
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
            { name: 'Charlie', age: 35 }
        ]);
    });

    test('Pop method', () => {
        db.pop('users');
        expect(db.get('users')).toEqual([
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 }
        ]);
    });


    test('Pull method', () => {
        db.pull('users', (user: any) => user.age > 25, true);
        expect(db.get('users')).toEqual([
            { name: 'Alice', age: 25 }
        ]);
    });

    test('Find method', () => {
        const user = db.find('users', (user: any) => user.age === 25);
        expect(user).toEqual({
            name: 'Alice',
            age: 25
        });
    });

    test('Distinct method', () => {
        db.push('users', { name: 'Charlie', age: 35 });
        db.push('users', { name: 'Charlie', age: 35 });
        db.distinct('users');
        expect(db.get('users')).toEqual([
            { name: 'Alice', age: 25 },
            { name: 'Charlie', age: 35 }
        ]);
    });

    test('Add method', () => {
        db.add('points', 10);
        expect(db.get('points')).toBe(10);
    });

    test('Multiply method', () => {
        db.multiply('points', 2);
        expect(db.get('points')).toBe(20);
    });

    test('Double method', () => {
        db.double('points');
        expect(db.get('points')).toBe(40);
    });

    test('Subtract method', () => {
        db.subtract('points', 20);
        expect(db.get('points')).toBe(20);
    });

    test('Math method', () => {
        db.math('points', '+', 10);
        expect(db.get('points')).toBe(30);
        db.math('points', '*', 2);
        expect(db.get('points')).toBe(60);
        db.math('points', '/', 2);
        expect(db.get('points')).toBe(30);
        db.math('points', '-', 10);
        expect(db.get('points')).toBe(20);
    });

    test('Type method', () => {
        expect(db.type('points')).toBe('number');
        expect(db.type('users')).toBe('array');
    });

    test('Size method', () => {
        expect(db.size('users')).toBe(2);
    });

    test('Has method', () => {
        expect(db.has('users')).toBe(true);
    });

    test('Starts with method', () => {
        expect(db.startsWith('users')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ]
        })
    });

    test('Ends with method', () => {
        expect(db.endsWith('s')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ],
            points: 20
        })
    });

    test('Includes method', () => {
        expect(db.includes('i')).toEqual({
            points: 20
        });
    });

    test('Keys method', () => {
        expect(db.keys()).toEqual(['users', 'points']);
    });

    test('Values method', () => {
        expect(db.values()).toEqual([
            [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ],
            20
        ]);
    });

    test('Entries method', () => {
        expect(
            db.all('array')
        ).toEqual([
            {
                key: 'users',
                value: [
                    { name: 'Alice', age: 25 },
                    { name: 'Charlie', age: 35 }
                ]
            },
            {
                key: 'points',
                value: 20
            }
        ]);

        expect(
            db.all('object')
        ).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ],
            points: 20
        });
    });

    test('Clear method', () => {
        db.clear();
        expect(db.get('users')).toBeUndefined();
        expect(db.get('points')).toBeUndefined();
    });
});

describe('JSON Driver with nested', () => {
    let db: any;
    beforeAll(() => {
        db = new GoodDB(new JSONDriver({
            path: "./tests/db.json"
        }), {
            nestedIsEnabled: true,
            nested: '..'
        });
    });

    afterAll(() => {
        fs.unlinkSync('./tests/db.json');
    });

    test('Set method', () => {
        db.set('data..users', [{ name: 'Alice', age: 25 }]);
        expect(db.get('data')).toEqual({
            users: [{ name: 'Alice', age: 25 }]
        });
    });

    test('Get method', () => {
        expect(db.get('data..users')).toEqual([{ name: 'Alice', age: 25 }]);
    });

    test('Delete method', () => {
        db.delete('data..users');
        expect(db.get('data..users')).toBeUndefined();
    });

    test('Push method', () => {
        db.push('data..users', { name: 'Alice', age: 25 });
        db.push('data..users', { name: 'Bob', age: 30 });
        db.push('data..users', { name: 'Charlie', age: 35 });
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Bob', age: 30 },
                { name: 'Charlie', age: 35 }
            ]
        });
    });

    test('Shift method', () => {
        db.shift('data..users');
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Bob', age: 30 },
                { name: 'Charlie', age: 35 }
            ]
        });
    });

    test('Unshift method', () => {
        db.unshift('data..users', { name: 'Alice', age: 25 });
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Bob', age: 30 },
                { name: 'Charlie', age: 35 }
            ]
        });
    });

    test('Pop method', () => {
        db.pop('data..users');
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Bob', age: 30 }
            ]
        });
    });


    test('Pull method', () => {
        db.pull('data..users', (user: any) => user.age > 25, true);
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Alice', age: 25 }
            ]
        });
    });

    test('Find method', () => {
        const user = db.find('data..users', (user: any) => user.age === 25);
        expect(user).toEqual({
            name: 'Alice',
            age: 25
        });
    });

    test('Distinct method', () => {
        db.push('data..users', { name: 'Charlie', age: 35 });
        db.push('data..users', { name: 'Charlie', age: 35 });
        db.distinct('data..users');
        expect(db.get('data')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ]
        });
    });

    test('Add method', () => {
        db.add('data..points', 10);
        expect(db.get('data..points')).toBe(10);
    });

    test('Multiply method', () => {
        db.multiply('data..points', 2);
        expect(db.get('data..points')).toBe(20);
    });

    test('Double method', () => {
        db.double('data..points');
        expect(db.get('data..points')).toBe(40);
    });

    test('Subtract method', () => {
        db.subtract('data..points', 20);
        expect(db.get('data..points')).toBe(20);
    });

    test('Math method', () => {
        db.math('data..points', '+', 10);
        expect(db.get('data..points')).toBe(30);
        db.math('data..points', '*', 2);
        expect(db.get('data..points')).toBe(60);
        db.math('data..points', '/', 2);
        expect(db.get('data..points')).toBe(30);
        db.math('data..points', '-', 10);
        expect(db.get('data..points')).toBe(20);
    });

    test('Type method', () => {
        expect(db.type('data..points')).toBe('number');
        expect(db.type('data..users')).toBe('array');
    });

    test('Size method', () => {
        expect(db.size('data..users')).toBe(2);
    });

    test('Has method', () => {
        expect(db.has('data..users')).toBe(true);
    });

    test('Starts with method', () => {
        expect(db.startsWith('data..users')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ]
        })
    });

    test('Ends with method', () => {
        expect(db.endsWith('data..s')).toEqual({
            users: [
                { name: 'Alice', age: 25 },
                { name: 'Charlie', age: 35 }
            ],
            points: 20
        })
    });

    test('Includes method', () => {
        expect(db.includes('data..i')).toEqual({
            points: 20
        });
    });

    test('Keys method', () => {
        expect(db.keys()).toEqual(['data']);
    });

    test('Values method', () => {
        expect(db.values()).toEqual([
            {
                users: [
                    { name: 'Alice', age: 25 },
                    { name: 'Charlie', age: 35 }
                ],
                points: 20
            }
        ]);
    });

    test('Entries method', () => {
        expect(
            db.all('array')
        ).toEqual([
            {
                key: 'data',
                value: {
                    users: [
                        { name: 'Alice', age: 25 },
                        { name: 'Charlie', age: 35 }
                    ],
                    points: 20
                }
            }
        ]);

        expect(
            db.all('object')
        ).toEqual({
            data: {
                users: [
                    { name: 'Alice', age: 25 },
                    { name: 'Charlie', age: 35 }
                ],
                points: 20
            }
        });
    });

    test('Clear method', () => {
        db.clear();
        expect(db.get('data..users')).toBeUndefined();
        expect(db.get('data..points')).toBeUndefined();
    });
});