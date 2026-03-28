---
description: Integrates AI agents with a centralized Qdrant memory to share context, problem resolutions, and scripts across all developers.
---

# Collective Memory Skill

This skill enables all AI agents working on the project to act as a single "collective brain." By utilizing Qdrant (a vector database), you can store semantic embeddings of code, error fixes, or project conventions, and recall them later.

## Core Concepts

1. **The Knowledge Graph (Qdrant):** Think of Qdrant as your long-term, shared memory. It connects to an online Qdrant VPS instance via API or MCP, allowing the team to share knowledge across all local environments without needing to host the database locally.
    * **Connection Details:** The connection URL and API Key for the Qdrant VPS are stored in the project's `.env` file (e.g., `QDRANT_URL` and `QDRANT_API_KEY`). The agent should always read these variables when initializing the MCP or making direct API calls.
2. **Context:** A "context" is a piece of information worth saving. Examples include:
    * "How to deploy the API to AWS using our custom script."
    * "The fix for the obscure Drizzle ORM schema error related to JSONB columns."
    * "The mandatory brand guidelines for the new frontend."

## When to use Collective Memory

### 1. RECALLING Memory (*Before* you start a complex task)
Whenever you are asked to solve a complex problem, debug an obscure error, or implement a feature using internal tools, your **first step** is to query the memory.
- Assume that another developer's AI might have already solved this.
- If the recalled context is relevant, use it immediately.
- If no relevant context is found, proceed with standard problem-solving.

### 2. MEMORIZING Context (*After* you solve a complex task)
When you successfully resolve a difficult error, write a highly reusable script, or define a new architectural pattern, your **final step** is to save it.
- **Do not** memorize trivial things (e.g., how to write a React component).
- **Do** memorize project-specific quirks, custom workarounds, or localized configurations.

## Tool Interface (To Be Implemented via MCP)

> Note: The actual MCP server tools to interact with Qdrant are expected to be exposed to your environment. When they are, they will likely match these signatures:

*   `recall_context(query: string)`: Use this to search the vector database. Search using natural language (e.g., "How to handle missing auth tokens in Hono").
*   `memorize_context(title: string, content: string, tags: string[])`: Use this to save knowledge. The `content` should be a self-contained, detailed markdown explanation of the problem and the solution.

## Mandatory Workflow Example

**Scenario:** A user asks "Why is the Next.js build failing with a Tailwind PurgeCSS error?"

1.  **AI Action 1:** `recall_context("Next.js build fail Tailwind PurgeCSS")`
2.  **AI Action 2:** (Reads Qdrant response: "Found entry: Added 'safelist' to tailwind.config.ts due to dynamic class names...")
3.  **AI Action 3:** The AI uses this information to fix the user's codebase instantly, without having to debug from scratch.
4.  **AI Action 4:** If the AI had to invent a *new* solution instead, it calls `memorize_context("Tailwind Safelist Fix", "When using dynamic UI generation, ensure...", ["nextjs", "tailwind", "bugfix"])`.
