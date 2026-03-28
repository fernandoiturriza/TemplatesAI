---
description: Instructs the DevOps agent on standard Git branching, semantic commits, and handling deployments.
---

# Git & Deployment Workflow Skill

This skill defines the Git standard operating procedure (SOP) and deployment workflow for the project. The DevOps agent (or any agent managing code versions) MUST follow these steps closely.

## 1. Branching Strategy (Feature-Branch Workflow)

*   **Main Branch (`main` / `master`):** Represents production-ready code. Never commit directly to `main`.
*   **Development Branch (`develop` or `dev`):** (If used) Represents the integration branch for next releases.
*   **Feature Branches:** Create branches off the main integration branch named logically:
    *   `feat/add-qdrant-memory`
    *   `fix/auth-token-refresh`
    *   `refactor/ui-components`
    *   `chore/update-dependencies`

> **Agent Action:** When asked to start a significant coding task, always run `git checkout -b <type>/<description>` first.

## 2. Semantic Commits

Every commit message MUST follow the Conventional Commits specification. This ensures changelogs can be generated automatically and PRs are readable.

**Format:**
`type(scope?): subject`

**Valid Types:**
*   `feat`: A new feature
*   `fix`: A bug fix
*   `docs`: Documentation only changes
*   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
*   `refactor`: A code change that neither fixes a bug nor adds a feature
*   `perf`: A code change that improves performance
*   `test`: Adding missing tests or correcting existing tests
*   `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Example:**
`git commit -m "feat(auth): integrate next-auth for google login"`

## 3. Pull Requests (PRs) and Code Review

When a feature branch is ready:
1. Push the branch to the remote repository.
2. If using an MCP for GitHub/GitLab, trigger the tool to create a Pull Request.
3. Review PRs created by others (or human developers). When reviewing:
    *   Provide concise feedback.
    *   Comment inline using the specific file and line numbers.
    *   Look for logic flaws, security vulnerabilities, or deviations from the `.agent/rules`.

## 4. Automatic Deployments

*   **Deployment Triggers:** Remind the team that pushing to `main` or merging a PR will typically trigger the automated deployment pipeline (e.g., GitHub Actions to Vercel/VPS).
*   **Check CI/CD:** Before merging, ensure all tests (`npm run test`) and linters (`npm run lint`) pass locally to avoid breaking the pipeline.
