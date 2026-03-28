---
name: Clean-Code-AI-Generation
description: Universal clean code guidelines specifically designed for AI agents to ensure generated code is robust, maintainable, context-aware, and free of common AI-generation pitfalls (e.g., hallucinated imports, over-engineering).
---

# Clean-Code-AI-Generation

AI agents can generate code extremely fast, but speed without discipline leads to technical debt. This skill enforces universal **Clean Code** principles, focusing specifically on areas where AI agents often make mistakes (like generating overly complex solutions, forgetting edge cases, or hallucinating dependencies).

---

# When This Skill Should Be Used

This is a **GLOBAL** skill. Use it whenever the agent:
* Generates any new logic, function, or class in any language.
* Proposes architectural changes.
* Writes tests.
* Refactors existing files.
* Documents code.

---

# Core AI Generation Rules

## 1. Avoid Hallucinations (Verify Dependencies)

AI models sometimes invent libraries, functions, or UI components that do not exist in the project or ecosystem.

### Rules
* **Only use standard libraries, authorized dependencies mapped in `package.json`, or existing internal project utilities.**
* Do not invent new internal utility functions if one already exists in the project (search context before writing).

## 2. Follow the Single Responsibility Principle (SRP)

Functions should do **exactly one thing** and do it well.

### Rules
* If a function has the word `And` or `Or` in its implied logic, it's probably doing too much.
* AI agents should aggressively break down large generated functions into smaller, composable helpers.

❌ Bad (AI generates a monolithic block)
```javascript
function processUserOrder(order) {
  // 1. Validate order
  if (!order.id) throw new Error('Invalid');
  // 2. Calculate discounts
  let total = order.price;
  if (order.coupon) total -= 10;
  // 3. Save to DB
  db.save(order);
  // 4. Send Email
  mail.send(order.email);
}
```

✅ Good (Modular and Composable)
```javascript
function processUserOrder(order) {
  validateOrder(order);
  const finalPrice = calculateDiscount(order.price, order.coupon);
  saveOrderToDatabase(order, finalPrice);
  sendOrderConfirmationEmail(order.email);
}
```

## 3. Meaningful and Specific Naming

Naming is critical for maintainability. Avoid generic names at all costs.

### Rules
* Avoid variables named `data`, `item`, `temp`, `res`, `result`, `obj`.
* Booleans should sound like questions (`isActive`, `hasPermission`, `canEdit`).
* Function names should start with a verb (`getUser`, `calculateTotal`, `initializeServer`).

## 4. Don't Repeat Yourself (DRY) but YAGNI (You Aren't Gonna Need It)

Find the balance between reusability and over-engineering.

### Rules
* **DRY:** If the agent generates the same logic twice, extract it into a helper.
* **YAGNI:** Do not over-engineer solutions for "future possibilities" unless explicitly requested by the user. Keep it simple and focused on the immediate task.

## 5. Meaningful Comments (Why, not What)

AI tends to over-comment code with obvious statements.

### Rules
* **DO NOT comment what the code is doing if the code is self-evident.**
* **DO comment WHY a specific approach was taken**, especially if it's a workaround, a complex regex, or business-logic specific.

❌ Bad
```javascript
// Add 1 to index
const nextIndex = i + 1;
```

✅ Good
```javascript
// We add 1 because the external API uses 1-based pagination while our internal array is 0-based.
const pageNumber = index + 1;
```

## 6. Error Handling & Edge Cases

AI generated code often assumes the "happy path".

### Rules
* Always check for `null`, `undefined`, and empty states.
* Ensure API calls or async operations have proper `try/catch` or `.catch()` blocks.
* Fail gracefully instead of crashing the application.

## 7. Context Preservation

When asked to update a specific function in a file:
* **Match the surrounding style.** If the file uses `function` declarations instead of arrow functions, adhere to the file's existing convention.
* Do not accidentally delete surrounding code when inserting new logic.
* Ensure imports are added at the top correctly.

---

# Expected Agent Behavior

When this skill is active, the agent MUST:
1. Double-check all generated imports to ensure they are real and available.
2. Produce modular, bite-sized functions with zero side-effects where possible.
3. Handle potential errors and edge cases proactively.
4. Refuse to write "clever" one-liners if a readable multi-line approach is clearer.
5. Provide code that looks like it was written by a Senior Engineer reviewing a PR.
