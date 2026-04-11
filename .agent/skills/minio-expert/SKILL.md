---
name: minio-expert
description: Use this skill for implementing S3-compatible object storage using MinIO. Covers Node.js SDK integration, bucket management, presigned URLs, and high-performance upload strategies.
---

# MinIO Expert Skill

## ⚙️ Initialization (Node.js)
Use the `minio` package for full S3 compatibility.

```typescript
import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});
```

---

## 📂 Bucket Management

### Ensuring Buckets Exist
```typescript
const bucket = 'my-bucket';
const exists = await minioClient.bucketExists(bucket);
if (!exists) {
    await minioClient.makeBucket(bucket, 'us-east-1');
}
```

### Lifecycle & Policies
- **Public Read**: Use for assets like images.
- **Private**: Use for sensitive data, access via Presigned URLs.

---

## 🔗 Presigned URLs
Generate temporary links for secure uploads/downloads without exposing credentials.

```typescript
// GET link (valid for 1 hour)
const url = await minioClient.presignedGetObject('my-bucket', 'file.png', 3600);

// PUT link (valid for 24 hours) for direct browser upload
const uploadUrl = await minioClient.presignedPutObject('my-bucket', 'new-upload.zip', 24 * 3600);
```

---

## 📤 Upload Strategies

### Small Files
Use `putObject` for simple uploads from Buffer or Stream.

```typescript
await minioClient.putObject(bucket, 'metadata.json', JSON.stringify(data));
```

### Large Files (Multipart)
The SDK handles multipart uploads automatically when using `fPutObject` (file path) or piping to a stream.

---

## 🛡️ Best Practices
1. **Error Handling**: Use `try/catch` specifically for network timeouts and 404 (NoSuchBucket).
2. **Metadata**: Use the `metadata` object to store custom key-value pairs (e.g., `user-id`, `original-filename`).
3. **IAM**: Never use the `admin` account in application code. Create a dedicated user with restricted access to specific buckets.
