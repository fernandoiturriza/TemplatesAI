---
description: Security guidelines detailing Field-Level Encryption, Zero-Knowledge Proofs, and SOC 2 Type II compliance.
---

# Security & Compliance Skill

This skill defines the mandatory security architecture for all applications within this project. The system is designed with **SOC 2 Type II** compliance in mind, meaning security, availability, processing integrity, confidentiality, and privacy are foundational.

## 1. Field-Level Encryption (FLE)

When storing sensitive Personally Identifiable Information (PII) such as SSNs, Bank Routing Numbers, or Medical Records, the data MUST be encrypted at the application layer *before* it reaches the database.

*   **Encryption Standard:** Use AES-256-GCM.
*   **Key Management:** Encryption keys must never be hardcoded. They must be injected via secure environment variables (e.g., `ENCRYPTION_MASTER_KEY`).
*   **Implementation Flow:**
    1.  **Backend Agent:** Intercept payload in the service layer.
    2.  **Backend Agent:** Encrypt sensitive fields using the master key.
    3.  **Backend Agent:** Store the cipher text and the initialization vector (IV) in the database.
    4.  **Backend Agent:** On retrieval, decrypt the fields before sending to the client (only if the requesting user possesses the necessary RBAC permissions).

## 2. Zero-Knowledge Proof (ZKP) Concepts for Authentication

For highly sensitive operations where the server does not need to know the actual value (e.g., passwords, security answers, or specific document verifications), implement a Zero-Knowledge approach.

*   **Never Store Raw Secrets:** Even the database administrator should not be able to read user passwords or vault keys.
*   **Hashing & Salting:** Use Argon2id or bcrypt (cost factor 12+) with unique salts per user for passwords.
*   **Client-Side Hashing (Optional for high security):** For extreme security Vaults, the client hashes their master password, derives a key, and encrypts their payload locally. The server only stores the *encrypted* vault and a hash of the derived key to verify login, meaning the server *never* possesses the key to decrypt the vault (Zero-Knowledge).

## 3. SOC 2 Type II Compliance (Code Level)

To maintain SOC 2 Type II compliance, all agents must enforce the following programming practices:

*   **Audit Logging (Processing Integrity):** Every critical action (login, data modification, permission change, sensitive data access) MUST create an immutable event log entry. The log must include: Timestamp, Actor ID (User), Action Performed, and Target ID.
*   **Least Privilege (Confidentiality):** Endpoints must explicitly verify permissions before returning data. Do not rely on UI hiding.
*   **Data Masking:** When logging errors or returning lists of data, mask sensitive fields (e.g., `****-****-****-1234`).
*   **Vulnerability Prevention:** Strictly validate all inputs using Zod to prevent SQL Injection, XSS, and parameter tampering. Validate both the *shape* and the *content* (e.g., string lengths, regex patterns for emails).

> **Agent Action:** If a user requests a feature dealing with user data or authentication, you MUST reference this skill and proactively implement the Audit Logger and Zod validations without being prompted.
