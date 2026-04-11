---
name: vertex-ai-api-dev
description: Use this skill for building applications on Google Cloud Vertex AI using the Generative AI SDK for Node.js. Covers authentication (ADC), high-scale generation, content caching, batch prediction, and enterprise-grade safety settings. Supports @google-cloud/vertexai for JavaScript/TypeScript.
---

# Vertex AI API Development Skill (Node.js)

## Critical Rules

> [!IMPORTANT]
> Vertex AI requires Google Cloud authentication (ADC) and project management.

### SDK (JavaScript/TypeScript)
- **Library**: `@google-cloud/vertexai`
- **Installation**: `npm install @google-cloud/vertexai`

### Authentication
Ensure you have set up Application Default Credentials:
```bash
gcloud auth application-default login
```

---

## Technical Details (Node.js/TypeScript)

### 1. Initialization
Requires `project` and `location`.

```typescript
import { VertexAI } from "@google-cloud/vertexai";

const vertexAI = new VertexAI({
    project: "your-project-id",
    location: "us-central1"
});

const model = vertexAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview"
});
```

### 2. Content Caching
Use for high-volume context (e.g., full documentation, codebase).

```typescript
const cache = await vertexAI.createCachedContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ role: "user", parts: [{ text: "..." }] }],
    ttl: "3600s"
});
```

---

## Detailed References
See the `/references` directory for in-depth guides on:
- **Advanced Features**: Caching, Batch, Thinking.
- **Structured Outputs**: JSON Schema, Tool calling.
- **Safety**: Filtering and moderation.
- **Media**: Image/Video generation.
- **Embeddings**: Vectorizing content.

---

## Documentation Lookup

**Index URL**: `https://cloud.google.com/vertex-ai/docs/generative-ai/llms.txt`

Key pages:
- [Vertex AI SDK for Node.js](https://cloud.google.com/vertex-ai/docs/generative-ai/start/sdk-nodejs.md.txt)
- [Model Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models.md.txt)
- [Context Caching](https://cloud.google.com/vertex-ai/docs/generative-ai/context-caching.md.txt)
