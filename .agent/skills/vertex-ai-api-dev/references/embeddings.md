# Text Embeddings (Vertex AI)

Generate embeddings for text content to perform semantic search, clustering, and other NLP tasks.

## Node.js Example
```typescript
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({project: '...', location: '...'});
const model = vertexAI.getGenerativeModel({model: 'text-embedding-004'});

const request = {
    content: {
        parts: [{text: 'What is the capital of France?'}]
    }
};
const response = await model.embedContent(request);
console.log(response.embedding);
```
