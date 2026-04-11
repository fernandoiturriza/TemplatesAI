---
name: gemini-live-api-dev
description: Use this skill for building real-time, bidirectional streaming applications with the Gemini Live API. Supports WebSocket-based audio/video/text streaming, voice activity detection (VAD), function calling, and session management. Supports @google/genai for JavaScript/TypeScript (Node.js and Web).
---

# Gemini Live API Development Skill

## Critical Rules

> [!IMPORTANT]
> The Gemini Live API requires **WebSockets** and works with special multimodal models.

### Target Models
- `gemini-3.1-pro-preview`
- `gemini-3-flash-preview`

### Key Differences from Standard API
- **Real-time**: Near-zero latency response.
- **Multimodal Stream**: Can receive and send raw audio bytes and video frames.
- **Interruptible**: The model can be stopped mid-sentence if the user starts speaking (VAD).

---

## Technical Details (Node.js/TypeScript)

### 1. Connection Lifecycle
Connect directly to the WebSocket endpoint or use the SDK wrapper.

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const liveSession = ai.models.startLiveSession({
    model: "gemini-3-flash-preview",
    config: {
        voice: "Puck" // Choose from: Puck, Aoide, Charon, Fenrir, Kore
    }
});

liveSession.on("content", (content) => {
    // Handle audio bytes or text
});

liveSession.send("Hello, I am ready to stream.");
```

### 2. Audio Processing (Node.js)
Use standard Node buffers and streaming libraries (like `ffmpeg` or `node-speaker`) to handle the bidirectional audio.

### 3. Function Calling (Live)
Functions are defined in the initial configuration. The model can pause the stream to wait for a tool result.

---

## Documentation Lookup

**Index URL**: `https://ai.google.dev/gemini-api/docs/live/llms.txt`

Key pages:
- [WebSocket Reference](https://ai.google.dev/gemini-api/docs/live/websocket-ref.md.txt)
- [Voice & Sound Configuration](https://ai.google.dev/gemini-api/docs/live/voice-config.md.txt)
- [Multimodal Inputs](https://ai.google.dev/gemini-api/docs/live/multimodal.md.txt)
