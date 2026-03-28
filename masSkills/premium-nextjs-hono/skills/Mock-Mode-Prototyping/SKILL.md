---
name: Mock Mode Prototyping
description: Use Zustand and its persist middleware to prototype modules entirely in-memory before backend integration.
---

# 🧪 Mock Mode Prototyping

When you are asked to build a new feature or module and the user specifies that they want it in "Mock Mode" or "in-memory", you should build the entire state and logic on the client side using Zustand.

This is highly effective for rapid prototyping and validating ideas before the real backend database and API are complete.

## Implementation Rules

1. **Use Zustand with `persist` middleware**: All domain state (e.g., `customers`, `invoices`, `tasks`) should be stored in a Zustand store.
2. **Mimic Database Operations**: Your store should include actions that mimic standard CRUD operations: `addX`, `updateX`, `deleteX`, `fetchX`. Do not rely on external API calls when in this mode.
3. **Generate IDs Locally**: Use `crypto.randomUUID()` when creating new records inside the store to simulate database primary keys.
4. **LocalStorage Persistence**: By using `persist`, you ensure that the mock data survives a page refresh, which is essential to demonstrate functionality realistically.
5. **Separate View from Logic**: Even though the data is mock, keep the React components completely separate from the store architecture, as if they were actually using asynchronous API calls (e.g. `const { data, addRecord } = useMyMockStore()`).

## Example Implementation (e.g., `store/useCustomersStore.ts`):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CustomersState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customerDetails: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomersStore = create<CustomersState>()(
  persist(
    (set) => ({
      customers: [],
      addCustomer: (customerDetails) => set((state) => ({
        customers: [
          ...state.customers,
          {
            ...customerDetails,
            id: crypto.randomUUID(),
            createdAt: new Date()
          }
        ]
      })),
      updateCustomer: (id, customerDetails) => set((state) => ({
        customers: state.customers.map(c => 
          c.id === id ? { ...c, ...customerDetails } : c
        )
      })),
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'customers-storage', // name of the item in the storage (must be unique)
    }
  )
);
```

## Transitioning to Production
When the real API is ready, you will simply replace the Zustand store calls in the UI with the actual API data fetching hooks (e.g., React Query or SWR), requiring minimal changes to the React components themselves.
