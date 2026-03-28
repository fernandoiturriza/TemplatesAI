---
description: An architectural blueprint for scaffolding a complete Security Center (MFA, Recovery Codes, Session Telemetry).
---

# Security Center Implementation Blueprint

This skill serves as the master blueprint for the **Orchestrator Agent**. When tasked to "implementa full seguridad," the Orchestrator MUST read this document and sequentially instruct the specialized agents (Schema Architect, Backend Engineer, Frontend Logic, UI/UX Designer) to build the following features from scratch.

This blueprint guarantees enterprise-level security features out-of-the-box for any new project based on this template.

---

## Phase 1: Database Schema (Schema Architect)

The Architect must define the following tables in the database schema (using Drizzle):

1.  **`users` Table Enhancements:**
    *   `mfa_enabled` (boolean, default false): Indicates if TOTP is active.
    *   `mfa_secret` (varchar/text): The encrypted TOTP secret key for Google Authenticator/Authy.
    *   `mfa_recovery_codes` (text[] or jsonb array): An array of 12 one-time-use alphanumeric codes.

2.  **`sessions` Table Creation:**
    *   `id` (uuid or varchar, primary key).
    *   `user_id` (foreign key to `users`).
    *   `device_name` (varchar): e.g., "MacBook Pro", "iPhone 13".
    *   `os` (varchar): e.g., "macOS", "iOS".
    *   `browser` (varchar): e.g., "Chrome", "Safari".
    *   `ip_address` (varchar).
    *   `last_active` (timestamp).
    *   `is_revoked` (boolean, default false): For remote session termination.

## Phase 2: Backend Services & API (Backend Engineer)

The Backend Engineer must create Hono routes and corresponding service logic:

1.  **MFA Service (`/api/auth/mfa`):**
    *   `POST /generate`: Uses a library like `otplib` to generate a new secret and an `otpauth://` URL. Returns the URL (for QR code generation) and the secret (for manual entry).
    *   `POST /verify`: Accepts the 6-digit PIN. If valid, updates `mfa_enabled = true` in the database and returns success.
    *   `POST /login-verify`: The secondary login step. If the user has `mfa_enabled`, regular login returns a prompt for MFA. This endpoint accepts the PIN to finalize the login and issue the session token.

2.  **Recovery Codes Service (`/api/auth/recovery`):**
    *   `POST /generate`: Generates 12 highly secure, 8-character codes. Hashes them (optional but recommended) or stores them in the `mfa_recovery_codes` array.
    *   `POST /consume`: Accepts one code. Validates it against the array. If found, **removes the code from the array** (one-time use), bypasses MFA, and issues a session token.

3.  **Session Telemetry Service (`/api/auth/sessions`):**
    *   `Middleware`: Upon every successful login, parse the `User-Agent` to extract device/OS/browser info. Capture the IP address. Insert a new record into the `sessions` table.
    *   `GET /list`: Returns a list of all active, non-revoked sessions for the current user.
    *   `POST /revoke/:id`: Sets `is_revoked = true` for the given session ID, immediately invalidating the associated JWT or session cookie.

## Phase 3: Frontend UI & Logic (Frontend & UI/UX Agents)

The Frontend team must build the "Security Center" dashboard (e.g., `/settings/security`):

1.  **Two-Factor Authentication (2FA) Panel:**
    *   **State:** Check if the user has `mfa_enabled`.
    *   **Action (Enable):** Opens a `MfaSetupModal`. Fetches the `otpauth://` URL from the API, renders it as a QR Code (using a library like `qrcode.react`), provides an input for the verification PIN.
    *   **Action (Disable):** Prompts for the current password/PIN to disable.

2.  **Emergency Recovery Codes View:**
    *   Displayed immediately after successfully enabling MFA.
    *   Shows the 12 generated codes in a clear, monospaced format.
    *   Includes a prominent "Download as TXT" or "Copy to Clipboard" button.
    *   **Warning:** Displays highly visible alerts (from the UI/UX rules) stating these codes will never be shown again.

3.  **Active Sessions Telemetry Panel:**
    *   A table or list view iterating over the response from `/sessions/list`.
    *   Displays icons representing the device (Mobile/Desktop).
    *   Shows "Current Session" badge for the device currently being used.
    *   Includes a red "Revoke Access" button next to other sessions. Clicking this immediately terminates that specific session via the API.

> **Instruction to Agents:** When implementing this blueprint, always adhere to the project's existing UI components (Tailwind, Framer Motion) and Zod validation rules. The design must feel premium and secure.
