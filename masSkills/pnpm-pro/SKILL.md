---
name: pnpm-pro
description: Master pnpm as a high-performance package manager. Covers strict dependency management, content-addressable storage, workspaces, and recursive commands.
---

# pnpm Pro Skill

## 🏎️ Core Concepts

### 1. Content-Addressable Storage
Unlike npm/yarn, pnpm saves files in a single content-addressable store on the disk. This means:
- **Zero Disk Space Waste**: Packages are linked, not copied.
- **Speed**: Installs are significantly faster than npm.

### 2. Strict Link Structure
pnpm uses a non-flat `node_modules`. This prevents **phantom dependencies** (using a package that isn't explicitly in your `package.json`).

---

## 🏗️ Workspaces (Monorepos)
Uses a dedicated configuration file: `pnpm-workspace.yaml`.

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'libs/**'
```

### Workspace Commands
- **Install in all**: `pnpm install` (automatic workspace discovery).
- **Run recursive**: `pnpm -r run build` (runs build in all projects).
- **Filter**: `pnpm --filter "@my-org/api" run dev`.

---

## 🛠️ Essential Commands

| Command | Purpose |
| :--- | :--- |
| `pnpm install` | Install dependencies (uses `pnpm-lock.yaml`) |
| `pnpm add <pkg>` | Add a dependency |
| `pnpm dlx <pkg>` | Run a binary project without installing (like `npx`) |
| `pnpm prune` | Remove unreferenced packages from the store |
| `pnpm patch <pkg>` | Interactively patch a dependency (stores in `patches/`) |

---

## 🛡️ Best Practices
1. **Lockfile**: Always check in `pnpm-lock.yaml`.
2. **Selective Version Resolutions**: Use the `pnpm.overrides` field in `package.json` to force specific versions of sub-dependencies.
3. **Ghost Modules**: If a library fails because it expects a flat `node_modules`, use `public-hoist-pattern[]` in `.npmrc` instead of switching back to npm.
4. **CI/CD**: Use `pnpm install --frozen-lockfile` in CI to ensure reproducibility.
