# ⚡ Asisteme CLI - Antigravity Kit Orchestrator

> El puente definitivo entre tu código y la potencia de los Agentes Autónomos.

**Asisteme CLI** es una herramienta de orquestación diseñada para inyectar, actualizar y gestionar entornos de **Antigravity Kit** en cualquier proyecto. Permite a los desarrolladores configurar un ecosistema de agentes especialistas, reglas de limpio y habilidades dinámicas (skills) en cuestión de segundos.

---

## 🚀 Instalación y Uso Rápido

No necesitas instalación previa si tienes Node.js. Ejecútalo directamente en la raíz de tu proyecto:

```bash
npx @asistemeai/asisteme-cli
```

### Comandos Directos
| Comando | Descripción |
| :--- | :--- |
| `asisteme-cli init` | Inyecta el entorno `.agent` por primera vez. |
| `asisteme-cli update` | Sincroniza `.agent` con la última versión de la nube. |
| `asisteme-cli skills` | Menú interactivo para agregar habilidades adicionales. |
| `asisteme-cli context` | Configura el stack (React, Hono, DB) y genera el `PROJECT_CONTEXT.md`. |

---

## 🏗️ Anatomía del Entorno `.agent`

Cuando inicializas el kit, se crea una carpeta `.agent/` con la siguiente estructura:

-   **/agents**: Personas especializadas (Frontend, Backend, Security, etc.) que guían a la IA.
-   **/skills**: Conocimiento modular (Clean Code, Gemini API, MinIO, pnpm, etc.) que los agentes cargan bajo demanda.
-   **/rules**: Normas globales (GEMINI.md) que dictan el comportamiento y tono del asistente.
-   **/scripts**: Herramientas de validación automática (`checklist.py`) para asegurar la calidad del código.
-   **ARCHITECTURE.md**: El mapa completo de capacidades de tu entorno local.

---

## 🧩 Nuevos Skills Disponibles (v1.2.7+)

Hemos integrado las tecnologías más punteras para potenciar tus flujos agenticos:

-   **Google Gemini Pro & Live API**: Soporte para streaming multimodal bidireccional y modelos 1.5+.
-   **Vertex AI Expert**: Capacidades empresariales de Google Cloud (Content Caching, Batching).
-   **MinIO Expert**: Gestión de almacenamiento de objetos compatible con S3 y Presigned URLs.
-   **Package Managers (NPM/pnpm)**: Reglas estrictas de versionamiento, seguridad y optimización de workspaces.

---

## 🛡️ Flujo de Trabajo Recomendado

1.  **Init**: Lanza `npx @asistemeai/asisteme-cli` y elige `init`.
2.  **Context**: Ejecuta la opción `Define Contexto` para decirle a la IA qué tecnologías usas (Next.js, Tailwind, etc.).
3.  **Brainstorm**: Pide a tu IA: *"Lee PROJECT_CONTEXT.md e inicia un @[/brainstorm]"*.
4.  **Skills**: Si necesitas algo específico (ej. MinIO), usa `asisteme-cli skills` para inyectar el conocimiento necesario.
5.  **Verify**: Antes de pushear, corre `python .agent/scripts/checklist.py .` para asegurar que todo esté perfecto.

---

## 🤝 Créditos y Comunidad

Basado en el innovador **Antigravity Kit** de [vudovn](https://github.com/vudovn/antigravity-kit). 
Extendido y evolucionado por el equipo de **Asisteme** para flujos de IA de alto rendimiento.

---
© 2026 Asisteme AI.
