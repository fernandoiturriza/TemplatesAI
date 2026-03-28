---
name: High-Performance-Database
description: Enforces elite-level database interactions using Drizzle ORM and PostgreSQL. Focuses on indexes, avoiding N+1 queries, and atomic transactions.
---

# High-Performance-Database

This Super-Skill elevates backend engineering to enterprise standards, guaranteeing millisecond API responses and absolute data integrity.

## 1. N+1 Query Elimination

**Rules:**
*   **NEVER** execute a database query inside a loop.
*   **ALWAYS** use Drizzle's `with:` (Relational Queries) or `join` to fetch related data in a single round-trip to the database.
*   If fetching a list of stores and their owners, grab it all at once via relationships.

## 2. Advanced Indexing

**Rules:**
*   When defining Drizzle schemas, proactively define indexes (`index("name_idx").on(table.column)`) on columns that will be frequently searched, filtered, or used as foreign keys.
*   Use unique constraints where appropriate to prevent duplicate data at the database level.

## 3. Atomic Transactions

**Rules:**
*   Any operation that modifies more than one table (e.g., creating a Customer AND creating their initial Account) MUST be wrapped in `db.transaction(async (tx) => { ... })`.
*   Inside a transaction, use the `tx` object, never the global `db` object.

## Expected Output

A backend that scales effortlessly to millions of rows, with strictly typed relationships and perfectly optimized SQL queries.
