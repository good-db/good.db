# What is good.db ?

- good.db is a lightweight and easy-to-use Node.js library that enables developers to work with JSON files as a simple local database. It allows you to perform various database-like operations, such as setting, getting, adding, deleting, pushing, and pulling data from a JSON file.

## Installation

To use `good.db` in your project, you need to install the package via npm:

```shell
npm install good.db
```

## Changelog

All notable changes to this project will be documented in this section.

| Version | Release Date | Changes                                                                   |
| ------- | ------------ | -----------------------------------------------------------------------   |
| 1.5.0   | 2023-08-24   | - Introduced the table system for efficient data management.              |
| 1.6.0   | 2023-08-26   | - Expanded database support to include Yaml and Sqlite formats.           |
| 1.6.1   | 2023-09-03   | - Addressed issues related to nested data retrieval.                      |
| 1.6.4   | 2023-09-05   | - Fixed a critical bug in SQLite related to data deletion.                |
|         |              | - Enhanced data manipulation with the addition of versatile 'all' options. |
| 1.6.5   | 2023-09-06   | - Fixed a critical bug in SQLite related to data deletion.                |
| 1.6.7   | 2023-09-06   | - Resolved issues in JSON ("all method") and SQLite ("all method").       |
|         |              | - Fixed 'has' in YAML.                                                    |
|         |              | - This release is the stable version.                                     |
| 1.6.9   | 2023-09-21   | - Fixed an issue in SQLite driver where the `nestedEnabled` parameter was not functioning correctly in 'get' and 'set' methods.       |
| 1.6.15   | 2023-09-21   | - Fixed an issue in SQLite driver where the `nestedEnabled` parameter was not functioning correctly in 'delete', 'delete' and 'pull' method.       |

## How To Use

### Creating a Database Instance

You can create a new database instance using the `DataBaseJSON` class:

```js
const { DataBaseJSON, DataBaseSQLITE, DataBaseYAML } = require("good.db");

let db = new DataBaseJSON('database.json', true, '..');

db = new DataBaseYAML('database.yaml', true, '..')

db = new DataBaseSQLITE('database.sqlite', 'tableName', true, '..');
```


### Using Tables

Alternatively, you can use tables with the `JSONTable` class:

```js
const { JSONTable, YAMLTable, DataBaseSQLITE } = require("good.db");

let db = new JSONTable('folderName');

let table = db.table('file', true, '..');

db = new YAMLTable('folderName')

table = db.table('file', true, '..');

db = new DataBaseSQLITE('database.sqlite', 'tableName', true, '..');

table = db.table('tableName', true, '..');

```
```

- The third parameter `true` in the constructor enables nested data.
- The fourth parameter `'..'` specifies the separator to use for nesting.

### Nested Data and Separator

`Nested data` refers to the ability to store objects within objects, creating a hierarchical structure. The `separator` is used to indicate the separation between levels of nested data. For example, let's consider the following operations:

```js
db.set(`user..profile..name`, 'John', true, '..');
// This creates a nested structure: { user: { profile: { name: 'John' } } }
```

## Performing Operations

In this section, you'll learn how to perform various operations on the `good.db` database.

### Fetching Data

The `db.fetch` method is used to retrieve data from the database. Here's how to use it:

#### Method Signature

```js
db.fetch(key: string, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path to the data you want to fetch.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.fetch('user.name', true, '..');
// Returns: 'John'

// Example 2
db.fetch('user.age', true, '.');
// Returns: 25

// Example 3
db.fetch('user.skills');
// Returns: []

// Example 4
db.fetch('user.work', true, '..');
// Returns: 'Programmer'

// Additional Examples
db.fetch(`key..number`, false); // Returns: 10
db.fetch(`key.age`, true, '.'); // Returns: 5
db.fetch(`key..name`); // Returns: 'joe'
db.fetch(`key..array`); // Returns: []
db.fetch(`key..other..work`); // Returns: 'Programmer'
```

---

### Getting Data

The `db.get` method is used to get data from the database. Here's how to use it:

#### Method Signature

```js
db.get(key: string, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path to the data you want to get.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.get('user.name', true, '..');
// Returns: 'John'

// Example 2
db.get('user.age', true, '.');
// Returns: 25

// Example 3
db.get('user.skills');
// Returns: []

// Example 4
db.get('user.work', true, '..');
// Returns: 'Programmer'

// Additional Examples
db.get(`key..number`, false); // Returns: 10
db.get(`key.age`, true, '.'); // Returns: 5
db.get(`key..name`); // Returns: 'joe'
db.get(`key..array`); // Returns: []
db.get(`key..other..work`); // Returns: 'Programmer'
```

---

### Setting Data

The `db.set` method is used to set data in the database. Here's how to use it:

#### Method Signature

```js
db.set(key: string, value: any, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path where you want to set the data.
- `value` (required): The value you want to set.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.set('user.name', 'John', true, '..');
// Result: { user: { name: 'John' } }

// Example 2
db.set('user.age', 25);
// Result: { user: { name: 'John', age: 25 } }

// Example 3
db.set('user.work', 'Programmer', true, '.');
// Result: { user: { name: 'John', age: 25, work: 'Programmer' } }

// Additional Examples
db.set(`key`, value); // Example: To Set a Data
db.set(`key..number`, 10, false); // Result: "key..number": 10
db.set(`key.age`, 5, true, '.'); // Result: "key": { "age": 5 }
db.set(`key..name`, 'joe'); // Result: "key": { "age": 5, "name": "joe" }
db.set(`key..array`, []); // Result: "key": { "age": 5, "name": "joe", "array": [] }
db.set(`key..other..work`, 'Programmer'); // Result: "key": { "age": 5, "name": "joe", "array": [] , "other": { "work": "Programmer" } }
```

---

### Adding and Subtracting Numbers

For numerical operations, you can use `db.add` and `db.subtract`:

#### Method Signature

```js
db.add(key: string, value: number, nested?: boolean = true, separator?: string = '..');
db.subtract(key: string, value: number, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path where you want to perform the operation.
- `value` (required): The value you want to add or subtract.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.add('key', value);
// Result: Addition operation on the value

 in 'key'

// Example 2
db.subtract('key', value);
// Result: Subtraction operation on the value in 'key'

// Additional Examples
db.add('key..number', 5); // Result: 15
db.add(`key.age`, 5, true, '.'); // Result: 10
db.add(`key..newnum`, 1); // Result: 1
db.subtract('key..number', 5); // Result: 10
db.subtract(`key.age`, 5, true, '.'); // Result: 5
db.subtract(`key..new_num`, 1); // Result: -1
```

---

### Pushing and Pulling Elements

Manipulate arrays using db.push and `db.pull`:

#### Method Signature

```js
db.push(key: string, value: any, nested?: boolean = true, separator?: string = '..');
db.pull(key: string, callbackOrValue: any, pullAll?: boolean = false, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path to the array you want to manipulate.
- `value` (required for `push`): The value you want to push to the array.
- `callbackOrValue` (required for `pull`): Either a value or an arrow function used to determine which elements to pull.
- `pullAll` (optional for `pull`): Boolean indicating whether to pull all matching elements.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.push('key', element);
// Result: Push the element to the array in 'key'

// Example 2
db.pull('key', element);
// Result: Pull the element from the array in 'key'

// Additional Examples
db.push('key..array', "Push", false); // Result: "key..array": ["Push"]
db.push('key..array', "Push2", false); // Result: "key..array": ["Push", "Push2"]
db.push('key..array', "Push3", false); // Result: "key..array": ["Push", "Push2", "Push3"]
db.push('key.array', "Push 1", true, "."); // Result: "key": { "name": "joe", "number": 0, "array": ["Push 1"] }
db.push('key..array', "Push 2"); // Result: "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2"] }
db.push('key..array', "Push 3"); // Result: "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2", "Push 3"] }
db.push('key..array', 4); // Result: "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2", "Push 3", 4] }
db.pull('key..array', "Push", false, false); // Result: "key": ["Push2", "Push3"]
db.pull('key..array', (element, index, array) => element, true, false); // Result: "key": []
db.pull('key.array', "Push 1", false, true, "."); // Result: "key": { "name": "joe", "number": 0, "array": ["Push 2", "Push 3", 4] }
db.pull('key..array', (element, index, array) => element.array.includes("Push"), true); // Result: "key": { "name": "joe", "number": 0, "array": [4] }
```

---

### Checking Data Existence

Check if a key exists using `db.has`:

#### Method Signature

```js
db.has(key: string, nested?: boolean = true, separator?:string = '..');
```

- `key` (required): The key or path to the data you want to check.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.has('key');
// Returns: true or false, indicating if 'key' exists in the database

// Additional Examples
db.has('key'); // Returns: true
db.has(`key..number..m`, false); // Returns: false
db.has(`key.age.n`, true, '.'); // Returns: false
db.has(`key..name`); // Returns: true
db.has(`key..array`); // Returns: true
db.has(`key..other..work`); // Returns: true
```

---


### Deleting Data

Delete data by key using `db.delete`:

#### Method Signature

```js
db.delete(key: string, nested?: boolean = true, separator?: string = '..');
```

- `key` (required): The key or path of the data you want to delete.
- `nested` (optional): Boolean indicating whether nested properties should be considered.
- `separator` (optional): The separator used for nested properties.

#### Examples

```javascript
// Example 1
db.delete('key');
// Result: Delete the data at 'key'

// Additional Examples
db.delete(`key..number`, false); // Result: true
db.delete(`key.age`, true, '.'); // Result: true
db.delete(`key..name`); // Result: true
db.delete(`key..array`); // Result: true
db.delete(`key..other..work`); // Result: true
```

---

### Retrieving All Data

To retrieve all data in the database, use `db.all()`:

#### Method Signature

```js
db.all(type?: number = 0);
```

- `type` (optional): Determines what to retrieve:
  - 0: Returns an array of objects containing ID and data for each key-value pair.
  - 1: Returns an array containing all keys.

#### Example

```javascript
// Retrieve an array of key-value pairs.
const allData = await db.all(0);
// Result: Returns an array of objects containing ID and data for each key-value pair.

// Retrieve an array of keys.
const allKeys = await db.all(1);
// Result: Returns an array containing all keys.
```

---

### Resetting the Database

You can reset the entire database using `db.reset()`:

```js
db.reset();
// Result: Deletes all data in the database
```

---

### Creating and Using Snapshots

You can capture the current state of the database with snapshots. Here's how to use the snapshot-related methods:

#### Creating Snapshots

Capture the current state of the database with snapshots using `db.createSnapshot`:

```js
db.createSnapshot(snapshotName);
```

- `snapshotName` (required): The name of the snapshot.

#### Rolling Back to a Snapshot

Roll back the database to a specific snapshot's state using `db.rollbackToSnapshot`:

```js
db.rollbackToSnapshot(snapshotName);
```

- `snapshotName` (required): The name of the snapshot to which you want to roll back.

#### Examples

Create and use snapshots:

```js
db.createSnapshot('backupName'); // Create a snapshot of the current database state.
db.rollbackToSnapshot('backupName'); // Roll back to the state of the specified snapshot.
```

---

## SQLite Implementation

The SQLite implementation of the database provides a way to store data using SQLite as the backend storage engine. This can be particularly useful when you require a more robust and performant storage solution. The `DataBaseSQLITE` class is provided for interfacing with the SQLite database.

### Usage

To use the SQLite implementation, you'll need to import the necessary classes and instantiate an instance of `DataBaseSQLITE`. Here's how you can set up and use the SQLite database:

```javascript
const { DataBaseSQLITE } = require('good.db');

// Create an instance of DataBaseSQLITE
const db = new DataBaseSQLITE();

(async () => {
    // Set a key-value pair
    await db.set('name', 'John Doe');
    
    // Get the value associated with a key
    const name = await db.get('name');
    console.log('Name:', name); // Output: Name: John Doe
})()
```

### Example

```javascript
const { DataBaseSQLITE } = require('good.db');

const db = new DataBaseSQLITE();

(async () => {
    // Set a key-value pair
    await db.set('name', 'Alice');
    
    // Push a value to an array
    await db.push('colors', 'blue');
    
    // Get the value associated with a key
    const name = await db.get('name');
    console.log('Name:', name); // Output: Name: Alice
    
    // Get all data in the database
    const allData = await db.all();
    console.log('All Data:', allData);
    
    // Create a snapshot
    await db.createSnapshot('backup1');
    
    // Roll back to a snapshot
    await db.rollbackToSnapshot('backup1');
})();
```

Absolutely, I understand what you're looking for. Here's the example you requested for the `table` method and its method signature:

---

### Creating and Using Custom Tables

The `table` method allows you to create and use custom tables for managing different sets of data. Here's how you can create and use custom tables:

#### Method Signature

```js
table(table: string, nestedEnabled?: boolean = false, separator?: string = '..');
```

- `table` (required): The name of the new table you want to create.
- `nestedEnabled` (optional): Boolean indicating whether nested properties are enabled for the new table (default: true).
- `separator` (optional): The separator used for nested properties (default: '..').

#### Examples

Create a custom table and perform database operations on it:

```js
(async () => {
    // Create a custom table instance
    const customTable = await db.table('user_data');
    
    // Set data in the custom table
    await customTable.set('username', 'john_doe');
    
    // Retrieve data from the custom table
    const username = await customTable.get('username');
    console.log('Username:', username); // Output: Username: john_doe
    
    // Push an element into an array in the custom table
    await customTable.push('scores', 100);
    
    // Delete data from the custom table
    const deleted = await customTable.delete('username');
    console.log('Deleted:', deleted); // Output: Deleted: true
})();
```

Creating and using custom tables allows you to manage and organize data separately within your SQLite database.

---

### Conclusion

The SQLite implementation of the database provides a powerful way to store and manage your data using SQLite as the backend storage engine. It offers features similar to the JSON implementation, but with the benefits of enhanced performance and robustness.

---

# Developer

- Developed By: [Joe](https://discord.com/users/833340407130882068)

This version of `good.db` is 1.6.15.