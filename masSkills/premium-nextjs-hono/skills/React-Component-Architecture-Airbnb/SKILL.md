---
name: React-Component-Architecture-Airbnb
description: Ensure that all React components generated or modified by the agent follow the Airbnb React/JSX Style Guide and modern React best practices (Hooks, Functional Components, Next.js App Router compatibility).
---

# React-Component-Architecture-Airbnb

This skill ensures that React code is clean, performant, accessible, and maintainable. It heavily borrows from the widely accepted **Airbnb React/JSX Style Guide**, adapted for modern React development using Functional Components, Hooks, and TypeScript.

---

# When This Skill Should Be Used

Use this skill whenever the agent:
* Creates new React components (`.jsx` or `.tsx`).
* Refactors or updates existing React code.
* Implements Custom Hooks.
* Structures Next.js or Vite React applications.
* Fixes React warnings or ESLint errors related to React/JSX.

---

# Required Coding Rules

## 1. Component Types and Syntax

### Rules
* **Always use Functional Components** instead of Class Components.
* Use Arrow Functions for component declarations.
* Use implicit returns for simple components where possible.

### Example
❌ Bad (Class Component)
```tsx
class UserProfile extends React.Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}
```

❌ Bad (Regular Function)
```tsx
function UserProfile({ name }) {
  return <div>{name}</div>;
}
```

✅ Good (Arrow Function Functional Component)
```tsx
const UserProfile = ({ name }) => (
  <div>{name}</div>
);
```

---

## 2. Naming Conventions

### Rules
* **Files:** Use `PascalCase` for files containing React components (e.g., `UserProfile.tsx`).
* **Components:** Use `PascalCase` for component names.
* **Hooks:** Use `camelCase` starting with `use` (e.g., `useAuth`).
* **Props:** Use `camelCase` for prop names. Use `on` prefixes for event handler props (e.g., `onClick`, `onChange`).

---

## 3. Props Handling

### Rules
* Always destructure props in the function signature.
* Do not use the `props` keyword inside the component body if avoidable.
* If using TypeScript, always define an `interface` or `type` for props immediately above the component.
* Provide default values directly in the destructuring if needed.

### Example
❌ Bad
```tsx
const Avatar = (props) => {
  return <img src={props.url} alt={props.name || 'User'} />;
};
```

✅ Good
```tsx
interface AvatarProps {
  url: string;
  name?: string;
}

const Avatar = ({ url, name = 'User' }: AvatarProps) => (
  <img src={url} alt={name} />
);
```

---

## 4. JSX Formatting

### Rules
* Wrap multiline JSX in parentheses.
* Self-close tags that have no children.
* Use boolean property shorthand (e.g., `disabled` instead of `disabled={true}`).
* Keep event handler functions concise. Extract complex logic outside of JSX.

### Example
❌ Bad
```tsx
const Button = ({ disabled, children }) => {
  return <button disabled={true} className="btn"></button>;
}
```

✅ Good
```tsx
const Button = ({ disabled, children }) => (
  <button disabled={disabled} className="btn">
    {children}
  </button>
);
```

---

## 5. Hooks and State

### Rules
* **Never call Hooks inside loops, conditions, or nested functions.** Always at the top level.
* Extract complex state logic into Custom Hooks or `useReducer`.
* Use `useCallback` for functions passed as props to memoized child components.
* Use `useMemo` for expensive calculations.
* Always define comprehensive dependency arrays for `useEffect`, `useCallback`, and `useMemo`.

### Example (Custom Hook Extraction)
❌ Bad (Bloated Component)
```tsx
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return /* ... */;
};
```

✅ Good (Separation of Concerns)
```tsx
const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logic...
  }, []);

  return { users, loading };
};

const UserList = () => {
  const { users, loading } = useFetchUsers();
  return /* ... */;
};
```

---

## 6. Structure and Imports

### Rules
* Group imports: Node modules first, then absolute path aliases, then relative imports.
* Order CSS/Styles imports last.
* Avoid massive files. If a component grows over 150-200 lines, extract sub-components or hooks.

---

# Expected Agent Behavior

When this skill is active, the agent MUST:
1. Ensure components are functional and utilize hooks correctly.
2. Structure new React files with clear interfaces and clean exports.
3. Automatically identify and fix React warnings (like missing keys in iterators or exhaustive-deps in useEffect).
4. Organize file imports cleanly.
5. Maximize reusability by suggesting or implementing smaller, focused components.
