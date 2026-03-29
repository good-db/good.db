
# Changelog for good.db v2.5.0

## New Features

- Added `setMany()` method - Set multiple key-value pairs at once
- Added `getMany()` method - Get multiple values by their keys at once
- Added `deleteMany()` method - Delete multiple keys at once
- Added `findAndUpdateMany()` method - Find and update multiple values in an array

## Improvements

- Refactored codebase into modular structure with separate method files:
  - `DatabaseMethods.ts` - Core database operations (set, get, delete, setMany, getMany, deleteMany)
  - `ArrayMethods.ts` - Array manipulation methods (push, shift, unshift, pop, pull, find, filter, findAndUpdate, findAndUpdateMany, distinct)
  - `MathMethods.ts` - Mathematical operations (add, subtract, multiply, double, math)
  - `CollectionMethods.ts` - Collection utilities (startsWith, endsWith, includes, keys, values, all, clear, type, size, has, table)
- Improved code organization and maintainability
- All JSDoc comments preserved for IDE intellisense support

---

# Changelog for good.db v2.4.1

## Improvements

- Added `good.db` types