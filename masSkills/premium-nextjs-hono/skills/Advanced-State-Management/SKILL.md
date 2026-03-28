---
name: Advanced-State-Management
description: Enforces top-tier React state management architecture using React Query for server state and Zustand/Jotai for global client state, ensuring maximum performance and zero prop-drilling.
---

# Advanced-State-Management

This Super-Skill guarantees that the project's state architecture rivals the top tech companies. It strictly divides **Server State** (data from APIs/DB) from **Client State** (UI toggles, themes, local selections).

## 1. Server State (React Query / SWR)

**Rules:**
*   **NEVER** use `useEffect` and `useState` to fetch data.
*   **ALWAYS** use React Query (or SWR) for data fetching, caching, synchronization, and optimistic updates.
*   Extract every API call into a custom hook (e.g., `export const useEmployees = () => useQuery(...)`).
*   Handle `isLoading`, `isError`, and `data` states properly in the UI.

## 2. Global Client State (Zustand / Jotai)

**Rules:**
*   **NEVER** use React Context for rapidly changing values (prevents unnecessary re-renders).
*   Use `Zustand` for complex, app-wide global state (e.g., User Session, Shopping Cart).
*   Keep stores extremely small and modular. Do not create one giant monolithic store.
*   Select only the exact piece of state needed to prevent re-renders (`const name = useStore(state => state.name)`).

## 3. Local Component State (useState / useReducer)

**Rules:**
*   Keep local state local. If a toggle only affects one button, use `useState`.
*   If local state has complex transition logic (e.g., a multi-step form), use `useReducer`.

## Expected Output

An application where data fetching is instantly cached, background-updated, and UI renders are optimized to the sub-millisecond.
