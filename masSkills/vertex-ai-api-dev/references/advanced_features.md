# Advanced Features (Vertex AI)

> [!NOTE]
> These examples are in Python. For Node.js, use `@google-cloud/vertexai`.

## Content Caching
Cache large documents or contexts to reduce cost and latency.

```python
from google import genai
from google.genai import types

client = genai.Client()

content_cache = client.caches.create(
    model="gemini-3-flash-preview",
    config=types.CreateCachedContentConfig(
        contents=[
            types.Content(
                role="user",
                parts=[types.Part.from_uri(file_uri="gs://your-bucket/large.pdf", mime_type="application/pdf")]
            )
        ],
        system_instruction="You are an expert researcher.",
        display_name="example-cache",
        ttl="86400s",
    ),
)
```

## Batch Prediction
For processing large datasets asynchronously.

```python
import time
from google import genai
from google.genai import types

client = genai.Client()

job = client.batches.create(
    model="gemini-3-flash-preview",
    src="gs://your-bucket/prompts.jsonl",
    config=types.CreateBatchJobConfig(dest="gs://your-bucket/outputs"),
)
```
