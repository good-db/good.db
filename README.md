# GoodDB

GoodDB is a lightweight and versatile database package for Node.js, offering support for various storage drivers including JSON, SQLite, YML, Cache, and MongoDB. It provides simple and intuitive methods to interact with your data, making it easy to integrate into your Node.js applications.

## Installation

You can install GoodDB via npm:

```bash
npm install good.db
```

## Usage

### Basic Usage

Initialize GoodDB with a driver:

```typescript
import GoodDB, { JSONDriver } from "good.db";

// Initialize GoodDB with a JSON driver
const db = new GoodDB(new JSONDriver());
```

Set and get data:

```typescript
// Set data
db.set("key", "value");

// Get data
const value = db.get("key");

console.log(value); // Output: value
```

### Advanced Usage

You can use different drivers based on your requirements. Here's how to use each driver:

#### JSON Driver

A driver that stores data in a JSON file.

```typescript
import { JSONDriver } from "good.db";

// Initialize GoodDB with a JSON driver
const db = new GoodDB(new JSONDriver({ path: "./data.json" }));
```

#### SQLite Driver

A driver that stores data in an SQLite database file.

```typescript
import { SQLiteDriver } from "good.db";

// Initialize GoodDB with an SQLite driver
const db = new GoodDB(new SQLiteDriver({ path: "./data.db" }));
```

#### YML Driver

A driver that stores data in a YAML file.

```typescript
import { YMLDriver } from "good.db";

// Initialize GoodDB with a YML driver
const db = new GoodDB(new YMLDriver({ path: "./data.yml" }));
```

#### MongoDB Driver

A driver that connects to a MongoDB database.

```typescript
import { MongoDBDriver } from "good.db";

// Initialize GoodDB with a MongoDB driver
const db = new GoodDB(new MongoDBDriver({ uri: "mongodb://localhost:27017", database: "mydb" }));
```

## API

### `set(key: string, value: any, options?: methodOptions): Promise<boolean> | boolean`

Sets a value for the specified key.

#### Parameters

- `key`: The key to set.
- `value`: The value to set.
- `options`: Optional options for setting the value.

#### Returns

- `true` if the value was set successfully, `false` otherwise.

#### Example

```typescript
// Set data
db.set("key", "value");
```

### `get(key: string, options?: methodOptions): Promise<any> | any`

Gets the value for the specified key.

#### Parameters

- `key`: The key to get the value for.
- `options`: Optional options for getting the value.

#### Returns

The value for the specified key.

#### Example

```typescript
// Get data
const value = db.get("key");
console.log(value); // Output: value
```

### `has(key: string, options?: methodOptions): Promise<boolean> | boolean`

Checks if a key exists in the database.

#### Parameters

- `key`: The key to check for existence.
- `options`: Optional options for checking.

#### Returns

- `true` if the key exists, `false` otherwise.

#### Example

```typescript
// Check if key exists
const exists = db.has("key");
console.log(exists); // Output: true or false
```

### `math(key: string, mathSign: string, value: number, options?: methodOptions): Promise<number> | number`

Performs mathematical operations on numeric values stored in the database.

#### Parameters

- `key`: The key of the numeric value to perform the operation on.
- `mathSign`: The mathematical operation sign (`+`, `-`, `*`, `/`).
- `value`: The value to perform the operation with.
- `options`: Optional options.

#### Returns

The result of the mathematical operation.

#### Example

```typescript
// Perform addition
const result = db.math("counter", "+", 5);
console.log(result); // Output: new value after addition
```

### `startsWith(key: string, options?: methodOptions): Promise<any> | any`

Retrieves all key-value pairs with keys starting with the specified prefix.

#### Parameters

- `key`: The prefix to search for.
- `options`: Optional options.

#### Returns

An object containing key-value pairs with keys starting with the specified prefix.

#### Example

```typescript
// Retrieve all keys starting with "user"
const data = db.startsWith("user");
console.log(data); // Output: { "user1": value1, "user2": value2, ... }
```

### `endsWith(key: string, options?: methodOptions): Promise<any> | any`

Retrieves all key-value pairs with keys ending with the specified suffix.

#### Parameters

- `key`: The suffix to search for.
- `options`: Optional options.

#### Returns

An object containing key-value pairs with keys ending with the specified suffix.

#### Example

```typescript
// Retrieve all keys ending with "info"
const data = db.endsWith("info");
console.log(data); // Output: { "user_info": value1, "profile_info": value2, ... }
```

### `push(key: string, value: any, options?: methodOptions): Promise<number> | number`

Appends a value to an array stored at the specified key.

#### Parameters

- `key`: The key of the array.
- `value`: The value to append.
- `options`: Optional options.

#### Returns

The new length of the array after appending the value.

#### Example

```typescript
// Append value to array
const length = db.push("list", "new value");
console.log(length); // Output: new length of the array
```

### `pull(key: string, valueOrCallback: any, pullAll?: boolean, options?: methodOptions): Promise<boolean> | boolean`

Removes elements from an array stored at the specified key.

#### Parameters

- `key`: The key of the array.
- `valueOrCallback`: The value or callback function to determine which elements to remove.
- `pullAll`: Whether to remove all matching elements.
- `options`: Optional options.

#### Returns

- `true` if elements were removed, `false` otherwise.

#### Example

```typescript
// Remove specific value from array
const removed = db.pull("list", "valueToRemove");
console.log(removed); // Output: true or false
```

### `add(key: string, value: number, options?: methodOptions): Promise<number> | number`

Adds a numeric value to the existing value stored at the specified key.

#### Parameters

- `key`: The key of the numeric value.
- `value`: The value to add.
- `options`: Optional options.

#### Returns

The new value after addition.

#### Example

```typescript
// Add value to existing number
const newValue = db.add("counter", 5);
console.log(newValue); // Output: new value after addition
```

### `subtract(key: string, value: number, options?: methodOptions): Promise<number> | number`

Subtracts a numeric value from the existing value stored at the specified key.

#### Parameters

- `key`: The key of the numeric value.
- `value`: The value to subtract.
- `options`: Optional options.

#### Returns

The new value after subtraction.

#### Example

```typescript
// Subtract value from existing number
const newValue = db.subtract("counter", 5);
console.log(newValue); // Output: new value after subtraction
```

### `delete(key: string, options?: methodOptions): Promise<boolean> | boolean`

Deletes the value associated with the specified key.

#### Parameters

- `key`:

 The key to delete.
- `options`: Optional options.

#### Returns

- `true` if the value was deleted successfully, `false` otherwise.

#### Example

```typescript
// Delete data
const deleted = db.delete("key");
console.log(deleted); // Output: true or false
```

### `all(): Promise<any> | any`

Retrieves all key-value pairs in the database.

#### Returns

An object containing all key-value pairs in the database.

#### Example

```typescript
// Retrieve all data
const data = db.all();
console.log(data); // Output: { key1: value1, key2: value2, ... }
```
---
# Conclusion

GoodDB is a versatile and lightweight database package for Node.js, offering support for various storage drivers including JSON, SQLite, YML, Cache, and MongoDB. It provides simple and intuitive methods to interact with your data, making it easy to integrate into your Node.js applications.

## License

GoodDB is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Links

- [GitHub](https://github.com/good-db/good.db)
- [NPM](https://www.npmjs.com/package/good.db)
- [Documentation](https://good-db.github.io/)
- [Developer - Joe](https://discord.com/users/833340407130882068)