---
name: npm-best-practices
description: Use this skill for managing Node.js packages, optimizing package.json, handling Semantic Versioning (SemVer), securing dependencies with npm audit, and managing monorepo workspaces.
---

# NPM Best Practices Skill

## 🎯 Core Concepts

### 1. Semantic Versioning (SemVer)
- **Patch (0.0.x)**: Backward-compatible bug fixes.
- **Minor (0.x.0)**: Backward-compatible new features.
- **Major (x.0.0)**: Breaking changes.

> [!TIP]
> Use `^` (caret) to allow minor/patch updates, or `~` (tilde) for patch-only. For high-stability production, consider pinning versions without prefixes.

### 2. Dependency Management
- **dependencies**: Required for runtime.
- **devDependencies**: Only for local development and testing.
- **peerDependencies**: Required by the consuming project (use for plugins/libraries).

---

## 🛡️ Security & Health

### npm audit
Always run `npm audit` before committing `package-lock.json`.
- Use `npm audit fix` for automatic updates.
- Use `npm audit fix --force` with caution (may introduce breaking changes).

### lockfile integrity
Never manually edit `package-lock.json`. It ensures deterministic installs across environments.

---

## 📦 Workspaces (Monorepos)
Configure in root `package.json`:
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```
Run commands across all workspaces: `npm run build -w app-name` or `npm run build --workspaces`.

---

## 🚀 Publishing Best Practices
1. **`.npmignore`**: Exclude tests, source code (if shipping transpiled JS), and config files.
2. **`files` field**: Explicitly include only the artifacts you want to publish in `package.json`.
3. **Provenance**: Use `--provenance` to link the package to its source repository and build CI.

```bash
npm publish --access public --provenance
```

---

## 🛠️ Common Optimization Scripts
```json
"scripts": {
  "clean": "rimraf dist",
  "prebuild": "npm run clean",
  "build": "tsc",
  "prepare": "npm run build"
}
```
`prepare` runs automatically before `npm publish` and after `npm install` (locally).
