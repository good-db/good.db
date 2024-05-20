# GoodDB

![GoodDB Logo](https://i.imgur.com/PSrNMwZ.png)

GoodDB is a lightweight and flexible TypeScript database wrapper that simplifies interactions with your database. It offers a simple API, supports various drivers, and is designed with modern TypeScript development in mind.

## Features

- **Simple API**: GoodDB provides a simple and intuitive API for common database operations, making it easy to use and understand.
- **Multiple Drivers**: Choose from a variety of drivers to store data in memory, files, or databases such as SQLite, MongoDB, and more.
- **Async/Await Support**: GoodDB supports async/await for seamless integration with modern JavaScript and TypeScript applications.
- **Flexible Configuration**: Customize the database configuration to suit your needs, including table/collection names, nested key handling, and more.
- **Type Safety**: GoodDB is written in TypeScript and provides type definitions for a seamless development experience.
- **Fast and Lightweight**: GoodDB is fast and lightweight, making it ideal for small to medium-sized applications.
- **Caching**: GoodDB supports caching to improve performance and reduce the number of database queries.

## Installation

You can install GoodDB via npm:

```bash
npm install good.db
```


### Configuration

You can customize the database configuration by passing options to the driver:

```typescript
const db = new GoodDB(new JSONDriver({ path: './database.json' }), {
  table: 'data',
  nested: '.',
  nestedIsEnabled: true,
  cache: {
    isEnabled: true,
    capacity: 1024
  }
});
```

- `table` (string): The name of the table/collection in the database.

- `nested` (string): The character used to separate nested keys.

- `nestedIsEnabled` (boolean): Whether to enable nested key handling.

- `cache` 
  - `isEnabled` (boolean): Whether to enable caching.
  - `capacity` (number): The maximum number of entries to cache.

## Drivers

GoodDB supports the following drivers:

### MemoryDriver

The `MemoryDriver` stores data in memory. It is suitable for small applications and is easy to set up.

```typescript
import { GoodDB, MemoryDriver } from 'good.db';

const db = new GoodDB(new MemoryDriver());
```

### SQLiteDriver

The `SQLiteDriver` stores data in an SQLite database. It is suitable for small to medium-sized applications and is easy to set up.

```typescript
import { GoodDB, SQLiteDriver } from 'good.db';

const db = new GoodDB(new SQLiteDriver({ path: './database.sqlite' }));
```

### YMLDriver

The `YMLDriver` stores data in a YML file. It is suitable for small to medium-sized applications and is easy to set up.

```typescript
import { GoodDB, YMLDriver } from 'good.db';

const db = new GoodDB(new YMLDriver({ path: './database.yml' }));
```

### JSONDriver

The `JSONDriver` stores data in a JSON file. It is suitable for small to medium-sized applications and is easy to set up.

```typescript
import { GoodDB, JSONDriver } from 'good.db';

const db = new GoodDB(new JSONDriver({ path: './database.json' }));
```

### MongoDBDriver

The `MongoDBDriver` stores data in a MongoDB database. It is suitable for medium to large-sized applications and offers advanced features.

```typescript
import { GoodDB, MongoDBDriver } from 'good.db';

const db = new GoodDB(new MongoDBDriver({ uri: 'mongodb://localhost:27017/mydb' }));

await db.connect();
```

### PostgreSQLDriver

The `PostgreSQLDriver` stores data in a PostgreSQL database. It is suitable for medium to large-sized applications and offers advanced features.

```typescript
import { GoodDB, PostgreSQLDriver } from 'good.db';

const db = new GoodDB(new PostgreSQLDriver({ 
  user: 'user', 
  host: 'localhost',
}));

await db.connect();
```

### MySQLDriver

The `MySQLDriver` stores data in a MySQL database. It is suitable for medium to large-sized applications and offers advanced features.

```typescript
import { GoodDB, MySQLDriver } from 'good.db';

const db = new GoodDB(new MySQLDriver({ 
  user: 'user',
  host: 'localhost'
}));
```

## Convert between Drivers

### Convertor Options

- `from` (Driver): The driver to convert from.
- `to` (Driver): The driver to convert to.
- `table` (string): The name of the table/collection to convert.

### Example

Convert an SQLite database to a JSON file:

```typescript
import { Convertor, SQLiteDriver, JSONDriver } from 'good.db';

const convertor = new Convertor({
    from: new SQLiteDriver({
        path: './client/database.sqlite'
    }),
    to: new JSONDriver({
        path: './client/database.json'
    }),
    table: 'all_tables',
});

convertor.convert().then(console.log).catch(console.error);
```

## Examples for All Methods:

#### `set(key: string, value: any, options?: methodOptions)`

Set a value in the database:

```typescript
// Sync
db.set('user', { name: 'Alice', age: 25 }); // true
```

#### `get(key: string, options?: methodOptions)`

Get a value from the database:

```typescript
db.get('user'); // { name: 'Alice', age: 25 }
```

#### `has(key: string, options?: methodOptions)`

Check if a key exists in the database:

```typescript
db.has('user'); // true
```

#### `delete(key: string, options?: methodOptions)`

Delete a key from the database:

```typescript
db.delete('user'); // true
```

#### `push(key: string, value: any, options?: methodOptions)`

Push a value to an array in the database:

```typescript
db.push('users', { name: 'Alice', age: 25 }); // true
db.push('users', { name: 'Bob', age: 30 }); // true
db.push('users', { name: 'Charlie', age: 35 }); // true
db.get('users'); // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]
```

#### `shift(key: string, options?: methodOptions)`

Remove the first element from an array in the database:

```typescript
db.shift('users'); // { name: 'Alice', age: 25 }
db.get('users'); // [{ name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]
```

#### `unshift(key: string, value: any, options?: methodOptions)`

Add an element to the beginning of an array in the database:

```typescript
db.unshift('users', { name: 'Alice', age: 25 }); // true
db.get('users'); // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]
```

#### `pop(key: string, options?: methodOptions)`

Remove the last element from an array in the database:

```typescript
db.pop('users'); // { name: 'Charlie', age: 35 }
db.get('users'); // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
```

#### `pull(key: string, value: any, options?: methodOptions)`

Remove a value from an array in the database:

```typescript
db.pull('users', { name: 'Bob', age: 30 }); // true
db.get('users'); // [{ name: 'Alice', age: 25 }]
```

```typescript
db.pull('users', (element) => element.age > 20); // true
db.get('users'); // []
```

#### `find(key: string, callback: (value: any, index: number, obj: any[]) => unknown, options?: methodOptions)`

Find a value in an array in the database:

```typescript
db.push('users', { name: 'Alice', age: 25 });
db.push('users', { name: 'Bob', age: 30 });
db.push('users', { name: 'Charlie', age: 35 });
db.find('users', (object) => object.name == 'Bob') // { name: 'Bob', age: 30 }
```

#### `distinct(key: string, value: string, options?: methodOptions)`
Get distinct values from an array in the database:

```typescript
db.push('users', "Alice");
db.push('users', "Alice");
db.push('users', "Alice");
db.distinct('users', "Alice"); // ['Alice']
```

#### `add(key: string, operand: number, options?: methodOptions)`

Add a number to a value in the database:

```typescript
db.set('score', 10);
db.add('score', 5); // 15
```

#### `subtract(key: string, operand: number, options?: methodOptions)`

Subtract a number from a value in the database:

```typescript
db.set('score', 10);
db.subtract('score', 5); // 5
```

#### `multiply(key: string, operand: number, options?: methodOptions)`

Multiply a value in the database by a number:

```typescript
db.set('score', 10);
db.multiply('score', 5); // 50
```

#### `divide(key: string, operand: number, options?: methodOptions)`

Divide a value in the database by a number:

```typescript
db.set('score', 10);
db.divide('score', 5); // 2
```

#### `math(key: string, operator: string, operand: number, options?: methodOptions)`

Perform a mathematical operation on a value in the database:

```typescript
db.set('score', 10);
db.math('score', '+', 5); // 15
db.math('score', '-', 5); // 10
db.math('score', '*', 5); // 50
db.math('score', '/', 5); // 10
```

#### `type(key: string, options?: methodOptions)`

Get the type of a value in the database:

```typescript
db.set('user', { name: 'Alice', age: 25 });
db.type('user'); // 'object'
```

#### `size(key: string, options?: methodOptions)`

Get the size of a value in the database:

```typescript
db.set('users', [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]);
db.size('users'); // 3
```

#### `startsWith(key: string, options?: methodsOptions)`

Get all the keys that start with a given string:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.startsWith('user'); // { user1: {  name: 'Alice', age: 25 }, user2: { name: 'Bob', age: 30 }, user3: { name: 'Charlie', age: 35 } }
```

#### `endsWith(key: string, options?: methodsOptions)`

Get all the keys that end with a given string:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.endsWith('1'); // { user1: {  name: 'Alice', age: 25 } }
```

#### `includes(key: string, options?: methodsOptions)`

Get all the keys that include a given string:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.includes('user'); // { user1: {  name: 'Alice', age: 25 }, user2: { name: 'Bob', age: 30 }, user3: { name: 'Charlie', age: 35 } }
```

#### `keys()`

Get all the keys in the database:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.keys(); // ['user1', 'user2', 'user3']
```

#### `values()`

Get all the values in the database:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.values(); // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }]
```

#### `all()`

Get all the entries in the database:

```typescript
db.set('user1', { name: 'Alice', age: 25 });
db.set('user2', { name: 'Bob', age: 30 });
db.set('user3', { name: 'Charlie', age: 35 });
db.all(); // { user1: { name: 'Alice', age: 25 }, user2: { name: 'Bob', age: 30 }, user3: { name: 'Charlie', age: 35 } }
```

#### `clear()`

Clear the database:

```typescript
db.clear(); // true
```

#### `table(name: string)`

Make table operations on the database:

```typescript
db.table('users').set('user1', { name: 'Alice', age: 25 }); // true
db.table('users').get('user1'); // { name: 'Alice', age: 25 }
```

#### `connect()`

Connect to the database (for ASYNC drivers like `MongoDBDriver`, `PostgreSQLDriver` and `MySQLDriver`):

```typescript
await db.connect();
```

#### `disconnect()`

Disconnect from the database (for ASYNC drivers like `MongoDBDriver`, `PostgreSQLDriver` and `MySQLDriver`):

```typescript
await db.disconnect();
```

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.


## Support

If you have any questions or need assistance, please feel free to open an issue or contact us at

- [Developer (Joe)](https://discord.com/users/833340407130882068)
- [GitHub Issues](https://github.com/good-db/good.db/issues)
- [NPM](https://www.npmjs.com/package/good.db)
- [Documentation](https://good-db.github.io/)


## License

GoodDB is licensed under the MIT License. See the [LICENSE](https://github.com/good-db/gooddb/blob/main/license.md) file for details.

---
