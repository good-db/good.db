
# Changelog for good.db v2.4.0

## New Features

### Convert between Drivers

Added a convertor functionality to enable conversion between different database drivers.

#### Convertor Options

- `from` (Driver): Specifies the driver to convert from.
- `to` (Driver): Specifies the driver to convert to.
- `table` (string): Specifies the name of the table/collection to convert.

#### Example

Convert an SQLite database to a JSON file "*This works in all drivers not just SQLite and JSON*":

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

## Improvements

- Enhanced stability and DRYness (Don't Repeat Yourself) across the package.
- Resolved issues and bugs in all methods.
- Updated the `table` method.
- Added `IAsyncGoodDB` and `ISyncGoodDB` interfaces for improved functionality.

## Changes

- Modified the return format of `all('array')` to `[{ key: "", value: "" }]` for better clarity and consistency.