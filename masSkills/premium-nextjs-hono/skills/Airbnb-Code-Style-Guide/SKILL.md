---
name: Airbnb-Code-Style-Guide
description: Ensure that all JavaScript and TypeScript code generated or modified by the agent follows the Airbnb JavaScript Style Guide, one of the most widely adopted conventions for consistent, readable, and maintainable code.
---

# Airbnb-Code-Style-Guide

* Consistent formatting across the codebase
* Predictable coding patterns
* Reduced cognitive load for developers
* Compatibility with ESLint configurations like `eslint-config-airbnb`

The Airbnb style guide emphasizes **immutability, functional patterns, clear naming, and modern ES modules**.

---

# When This Skill Should Be Used

Use this skill whenever the agent:

* Writes new JavaScript / TypeScript code
* Refactors existing code
* Generates React components
* Creates utilities, services, or modules
* Fixes style inconsistencies
* Reviews pull requests
* Generates examples or documentation

---

# Core Principles

The Airbnb style guide follows several core philosophies:

### 1. Prefer Immutability
Avoid mutating existing objects or parameters.

### 2. Prefer Declarative / Functional Code
Use array methods (`map`, `filter`, `reduce`) instead of loops.

### 3. Use Modern JavaScript
Prefer ES modules (`import/export`) instead of CommonJS.

### 4. Maintain Consistency
Follow strict formatting rules for spacing, naming, and structure.

### 5. Avoid Error-Prone Patterns
Avoid parameter reassignment, unused variables, and unsafe constructs.

---

# Required Coding Rules

## 1. Variables and References

### Rules
* Use `const` by default
* Use `let` only when reassignment is required
* Never use `var`

### Example

❌ Bad
```javascript
var count = 10;
count = 20;
```

❌ Bad
```javascript
let name = "John";
```

✅ Good
```javascript
const name = "John";
```

✅ Good (reassignment required)
```javascript
let count = 10;
count += 1;
```

---

# 2. Objects

### Rules
* Use object literal syntax
* Use property shorthand
* Use computed properties when dynamic keys are needed

### Example

❌ Bad
```javascript
const user = new Object();
user.name = "Maria";
```

✅ Good
```javascript
const user = {
  name: "Maria",
};
```

### Shorthand methods

❌ Bad
```javascript
const calculator = {
  add: function (a, b) {
    return a + b;
  },
};
```

✅ Good
```javascript
const calculator = {
  add(a, b) {
    return a + b;
  },
};
```

---

# 3. Arrays

### Rules
* Use array literals
* Use spread operator instead of `Array.prototype` mutation when possible
* Prefer array methods (`map`, `reduce`, `filter`) over loops

### Example

❌ Bad
```javascript
const numbers = new Array(1,2,3);
```

✅ Good
```javascript
const numbers = [1, 2, 3];
```

### Iteration

❌ Bad
```javascript
let sum = 0;

for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}
```

✅ Good
```javascript
const sum = numbers.reduce((total, n) => total + n, 0);
```

Functional iteration improves readability and reduces side effects.

---

# 4. Functions

### Rules
* Use arrow functions for anonymous functions
* Never mutate function parameters
* Never reassign parameters
* Use default parameters instead

### Example

❌ Bad
```javascript
function updateUser(user) {
  user.active = true;
}
```

✅ Good
```javascript
function updateUser(user) {
  return {
    ...user,
    active: true,
  };
}
```

### Default parameters

❌ Bad
```javascript
function createUser(name) {
  name = name || "Anonymous";
}
```

✅ Good
```javascript
function createUser(name = "Anonymous") {
  return { name };
}
```

---

# 5. Equality

### Rules
Always use **strict equality**
```javascript
=== and !==
```

Never use
```javascript
== or !=
```

Example:

❌ Bad
```javascript
if (count == 0) {
}
```

✅ Good
```javascript
if (count === 0) {
}
```

---

# 6. Modules

### Rules
Use ES modules instead of CommonJS.

❌ Bad
```javascript
const utils = require("./utils");

module.exports = utils;
```

✅ Good
```javascript
import utils from "./utils";

export default utils;
```

Modern modules improve tree-shaking and static analysis.

---

# 7. Spacing and Formatting

### Rules
* 2 spaces indentation
* Always include spaces inside braces
* Use single quotes for strings
* Always use semicolons

Example:

❌ Bad
```javascript
const user={name:"John"};
```

✅ Good
```javascript
const user = { name: 'John' };
```

---

# 8. Avoid Unused Variables

Unused variables should be removed.

❌ Bad
```javascript
const temp = 42;
```

✅ Good
```javascript
const result = calculateTotal();
```

Unused variables typically indicate incomplete refactoring.

---

# 9. Classes

### Rules
* Use ES6 classes
* Use `this` in instance methods
* Use `static` when instance state is not required

Example

❌ Bad
```javascript
class Logger {
  log() {
    console.log("hello");
  }
}
```

✅ Good
```javascript
class Logger {
  static log(message) {
    console.log(message);
  }
}
```

---

# 10. Preferred Iteration Pattern

Avoid:
```javascript
for
for..in
for..of
```

Prefer:
```javascript
map
filter
reduce
some
every
find
```

Example

❌ Bad
```javascript
const doubled = [];

for (const n of numbers) {
  doubled.push(n * 2);
}
```

✅ Good
```javascript
const doubled = numbers.map((n) => n * 2);
```

---

# ESLint Enforcement

Projects should include:
```bash
eslint-config-airbnb
eslint-plugin-import
eslint-plugin-react
eslint-plugin-jsx-a11y
```

Example `.eslintrc`:
```json
{
  "extends": ["airbnb"]
}
```

---

# Expected Agent Behavior

When this skill is active, the agent MUST:
1. Automatically format code according to Airbnb conventions.
2. Refactor non-compliant code.
3. Avoid generating code that violates the rules.
4. Prefer functional and immutable patterns.
5. Ensure readability and consistency across the project.

---

# Automatic Fix Patterns

When reviewing code, the agent should automatically:

| Problem            | Fix                               |
| ------------------ | --------------------------------- |
| `var` usage        | Replace with `const` or `let`     |
| loops              | Replace with functional iteration |
| `==`               | Replace with `===`                |
| parameter mutation | Replace with immutable copy       |
| CommonJS modules   | Convert to ES modules             |

---

# Example: Refactor to Airbnb Style

Before
```javascript
var users = [];

for (var i = 0; i < data.length; i++) {
  users.push(data[i].name);
}
```

After
```javascript
const users = data.map((user) => user.name);
```

---

# Success Criteria

The skill is correctly applied when:
* Code passes ESLint with the Airbnb configuration
* Code uses modern JavaScript patterns
* No style violations exist
* The codebase remains consistent and readable
