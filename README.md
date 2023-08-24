## What is good.db ?

- good.db is a lightweight and easy-to-use Node.js library that enables developers to work with JSON files as a simple local database. It allows you to perform various database-like operations, such as setting, getting, adding, deleting, pushing, and pulling data from a JSON file.



## Installation

- You need to install the package on your project

```shell

npm install good.db

```

## Changelog

All notable changes to this project will be documented in this section.

| Version | Release Date | Changes |
| ------- | ------------ | ------- |
| 1.5.0   | 2023-08-24   | Add table system & Creating and Using Snapshots |


## How To Use

## Creating a Database Instance
You can create a new database instance using the `DataBaseJSON` class:

```js
const { DataBaseJSON } = require("good.db");

const db = new DataBaseJSON('database.json', true, '..') // ("DATABASE_FILE", if you wanted enable/disable nested(..), if you wanted change separator default (..))
```

## Using Tables
Alternatively, you can use tables with the `JSONTable` class:

```js
const { JSONTable } = require("good.db");

const db = new JSONTable('tables') // ("TABLES_FOLDER")

let table = db.table('database', true, '..') // ("TABLE_FILE", if you wanted enable/disable nested(..), if you wanted change separator default (..))
```

### Tables notes

You can use the table normaly likes DataBaseJSON.

For example:

```js
table.set(`key`, value)
```

## Performing Operations

```js

// db.set(key "STRING", value "ANY", nested "BOOLEAN", separator "STRING")

db.set(`key`, value); // To Set a Data

db.set(`key..number`, 10, false); // => "key..number": 5

db.set(`key.age`, 5, true, '.'); // => "key": { "age": 5 }

db.set(`key..name`, 'joe'); // => "key": { "age": 5, "name": "joe" }

db.set(`key..array`, []); // => "key": { "age": 5, "name": "joe", "array": [] }

db.set(`key..other..work`, 'Programmer'); // => "key": { "age": 5, "name": "joe", "array": [] , "other": { "work": "Programmer" } }

```

### Getting Data
Retrieve data using the `db.get` or `db.fetch` method:

```js
// db.get(key "STRING", nested "BOOLEAN", separator "STRING")

db.get('key'); // To Get The Data By Key

db.get(`key..number`, false); // => 10

db.get(`key.age`, true, '.'); // => 5

db.get(`key..name`); // => joe

db.get(`key..array`); // => []

db.get(`key..other..work`); // => Programmer
```

```js
// db.fetch(key "STRING", nested "BOOLEAN", separator "STRING")

db.fetch('key'); // To Get The Data By Key

db.fetch(`key..number`, false); // => 10

db.fetch(`key.age`, true, '.'); // => 5

db.fetch(`key..name`); // => joe

db.fetch(`key..array`); // => []

db.fetch(`key..other..work`); // => Programmer
```

### Adding and Subtracting Numbers
For numerical operations, you can use `db.add` and `db.subtract`:

```js
// db.add(key "STRING", value "NUMBER", nested "BOOLEAN", separator "STRING")

db.add('key', value); // To Add a Number

db.add('key..number', 5); // => 15;

db.add(`key.age`, 5, true, '.'); // => 10

db.add(`key..name`, 1); // => ERROR

db.add(`key..newnum`, 1); // => 1
```

```js
// db.subtract(key "STRING", value "NUMBER", nested "BOOLEAN", separator "STRING")

db.subtract('key', value); // To Subtract a Number

db.subtract('key..number', 5); // => 10;

db.subtract(`key.age`, 5, true, '.'); // => 5

db.subtract(`key..name`, 1); // => ERROR

db.subtract(`key..new_num`, 1); // => -1

```

### Pushing and Pulling Elements
Manipulate arrays using `db.push` and `db.pull`:

```js
// db.push(key "STRING", value "ANY", nested "BOOLEAN", separator "STRING")

db.push('key', element); // To Push Element To Data

db.push('key..array', "Push", false); // "key..array": ["Push"]

db.push('key..array', "Push2", false); // "key..array": ["Push", "Push2"]

db.push('key..array', "Push3", false); // "key..array": ["Push", "Push2", "Push3"]

db.push('key.array', "Push 1", true, "."); // => "key": { "name": "joe", "number": 0, "array": ["Push 1"] };

db.push('key..array', "Push 2"); // => "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2"] };

db.push('key..array', "Push 3"); // => "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2", "Push 3"] };

db.push('key..array', 4); // => "key": { "name": "joe", "number": 0, "array": ["Push 1", "Push 2", "Push 3", 4] };
```


```js
// db.pull(key "STRING", callbackOrValue "STRING OR ARROW FUNCTION", pullAll "BOOLEAN", nested "BOOLEAN", separator "STRING")

db.pull('key', element); // To Pull Element From Data

db.pull('key..array', "Push", false, false); // "key": ["Push2", "Push3"]

db.pull('key..array', (element, index, array) => element, true, false); // "key": []

db.pull('key.array', "Push 1", false, true, "."); // => "key": { "name": "joe", "number": 0, "array": ["Push 2", "Push 3", 4] };

db.pull('key..array', (element, index, array) => element.array.includes("Push"), true); // => "key": { "name": "joe", "number": 0, "array": [4] };
```

### Checking Data Existence
Check if a key exists using `db.has`:

```js
// db.has(key "STRING", nested "BOOLEAN", separator "STRING")

db.has('key'); // To Get True Or False

db.has('key'); // => true

db.has(`key..number..m`, false) // => false

db.has(`key.age.n`, true, '.') // => false

db.has(`key..name`) // => true

db.has(`key..array`); // => true

db.has(`key..other..work`) // => true
```

### Deleting Data
Delete data by key using `db.delete`:
```js
// db.delete(key "STRING", nested "BOOLEAN", separator "STRING")

db.delete('key'); // To Delete Data By Key

db.delete(`key..number`, false) // => true

db.delete(`key.age`, true, '.') // => true

db.delete(`key..name`) // => true

db.delete(`key..array`); // => true

db.delete(`key..other..work`) // => true
```

### Retrieving All Data
To retrieve all data, use `db.all()`:

```js
db.all(); // To Get All Data

// Exmaple => [ { ID: `test`, data: `Hello World` } ]
```

### Resetting the Database
Reset the entire database using `db.reset()`:

```js
db.reset(); // To Delete All Data
```

### Creating and Using Snapshots

Capture the current state of the database with snapshots:
```js
db.createSnapshot('backupName'); // Create a snapshot of the current database state and store it in a separate JSON file.

db.rollbackToSnapshot('backupName'); // Roll back the database to a specific snapshot's state.
```


## Developer

- Developed By: [`Joe`](https://discord.com/users/833340407130882068)

Please feel free to improve this readme to meet your needs!