# Structured Output and Tools (Vertex AI)

## Structured Output (JSON Schema)
Enforce a specific JSON schema using `responseMimeType: "application/json"` and `responseSchema`.

## Function Calling
Define tools as an array of function declarations.

## Search Grounding
Ground the model's responses in Google Search.

```typescript
const request = {
    contents: [...],
    tools: [{ googleSearchRetrieval: {} }]
};
```
