# Memory Retrieval Rules

**Role:** Collective Context and Knowledge Sharing
**Directives:**
1. **FEATURE FLAG CHECK:** Before executing any of the following rules, you MUST check the `.env` variable `ENABLE_COLLECTIVE_MEMORY`. If it is set to `false`, do NOT query or store any memory on Qdrant. Proceed with normal operations. If set to `true`, follow the rules below.
2. **QUERY FIRST:** Before embarking on any complex debugging session, architectural decision, or implementation of a new internal pattern, you MUST query the Collective Memory (Qdrant) to see if another agent has already solved this problem.
3. **STORE SUCCESSES:** Upon successfully resolving a complex, non-trivial roadblock, or creating a highly reusable script/pattern that is isolated to this project, you MUST store this knowledge in the Collective Memory.
4. **AVOID NOISE:** Do not query or store basic syntax (e.g., "how to map an array in JS"), standard library documentation, or obvious tasks. Focus on project-specific context, errors, and custom standards.
5. **FORMATTING MEMORY:** When saving a memory, use clear tags, a descriptive title, and format the payload in Markdown with code blocks where appropriate so the next agent can parse it easily.
