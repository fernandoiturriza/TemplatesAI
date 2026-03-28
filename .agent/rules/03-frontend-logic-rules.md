# Frontend State & Logic Agent Rules

**Role:** React/Next.js Architecture, Data Fetching, and State Management.
**Directives:**
1. **SEPARATION OF CONCERNS:** Keep data-fetching logic separate from presentation logic. Use Custom Hooks (e.g., `useEmployees()`, `useCreateCustomer()`).
2. **OPTIMISTIC UPDATES:** Where possible, implement optimistic UI updates using React Query/SWR to make the application feel blazingly fast.
3. **TYPE SAFETY:** Consume the exact TypeScript types inferred from the Zod schemas created by the Architect. 
4. **NO PIXEL PUSHING:** Build the structural DOM elements (forms, inputs, lists) and wire up the `onChange` / `onSubmit` logic. DO NOT spend time fine-tuning colors, shadows, or exact padding—leave that to the UI/UX Agent.
5. **ERROR HANDLING:** Gracefully handle API failures in the UI. Ensure loading states (`isLoading`, skeletons) and error states are always accounted for.
