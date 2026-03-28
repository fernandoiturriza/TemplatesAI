---
name: Module Scaffolding
description: Instructions for creating a fully functional new feature module cleanly adhering to the template's architecture.
---

# 🏗️ Module Scaffolding Skill

When asked to create a new feature module (e.g., "Create the billing module", "Add an HR module"), you must build it adhering to this specific modular application pattern:

## Step 1: Create the Feature Directory
All new modules live inside `src/app`.
- Create a new folder and entry page for the module: `src/app/(ruta-del-modulo)/page.tsx`.
- Optionally, if the module has dynamic nested routes, structure it like `src/app/(ruta-del-modulo)/[id]/page.tsx`.

## Step 2: Wire up the Sidebar Navigation
- Open `src/components/layout/Sidebar.tsx`.
- Import a relevant semantic icon from `lucide-react` (e.g., `Receipt` for billing, `Users` for HR).
- Add the new module to the `menuItems` array so the user can easily navigate to it via the main app layout.

## Step 3: Implement Module State Architecture (Zustand)
- We do not mix UI component state with complex Domain state.
- Create a new store file under `src/lib/store/use[ModuleName]Store.ts`.
- Follow the `Mock-Mode-Prototyping.md` skill to generate a Zustand store featuring standard simulated CRUD operations.

## Step 4: UI Scaffolding
- Inside the module's main `page.tsx`, use a standard layout featuring a semantic Header (`<h1/>`) with the module's title.
- For the content area, initialize testing containers using the `.card-pastel` base class.
- Import and connect the module's Zustand store immediately to prove the data flow is active (e.g., render an empty state or map mock items).
