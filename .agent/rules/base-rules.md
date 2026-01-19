---
trigger: always_on
glob: "**/*"
description: "Core rules and standards for the Luatra Turbo Monorepo (Next.js, Python, Firebase, pnpm)."
---

# Luatra Monorepo Agent Rules

You are working in the **Luatra Turbo Monorepo**. This project contains multiple Next.js applications and a shared Python agent backend.
Adhere strictly to these rules to maintain production quality and implementation consistency.

## 1. Monorepo & Package Management
- **Package Manager**: STRICTLY use `pnpm`. Never use `npm` or `yarn`.
- **Workspace**:
  - Apps are located in `apps/` (e.g., `joatra`, `finatra`, `hub`, `agent-backend`).
  - Shared packages are in `packages/` (e.g., `ui`, `core`).
- **Commands**:
  - Run commands from the **root** using `turbo`.
  - Example: `pnpm build` (runs turbo build), `pnpm dev` (runs turbo dev).
  - To install dependencies: `pnpm add <pkg> --filter <workspace-name>`.
- **New Files**: Always verify the correct workspace directory before creating files.

## 2. Tech Stack & Architecture
### Frontend (Apps: joatra, finatra, hub)
- **Framework**: **Next.js 15+ (App Router)**. Use Server Components by default; add `"use client"` only when necessary.
- **Language**: **TypeScript**. STRICT typing. No `any` allow-list.
- **Styling**: **Tailwind CSS**.
- **State/Effects**: React 19 rules apply.
- **Backend Services**:
  - **Firebase**: Used for Authentication and Database (Firestore).
  - **Google Cloud**: Functions and generic cloud resources.
  - **E2B**: Used for secure sandboxed code execution (Agent environment).

### Backend (App: agent-backend)
- **Language**: **Python**.
- **Role**: Intelligent agent processing using a Broker/Worker pattern.
- **Architecture (`luatra-agent-system`)**:
  - **Agents**: Must inherit from `BaseAgent`. Implement `process(message, context)`.
  - **Orchestration**: Use `ManagerAgent` to route intents to specific Worker agents.
  - **Tools**: Define using `ActionTool` (Pydantic models for schema).
  - **Execution**: Use `E2B` sandbox for secure code execution (see `libs/agent-core/services/sandbox.py`).
- **Communication**: Streaming responses (NDJSON) to frontend.

## 3. UI & Design System (`@repo/ui`)
- **Design Standard**: Strictly adhere to the **Neo-Victorian Design Standard** (see `.agent/rules/design-rules.md`).
- **Shared Library**: All reusable UI components reside in `packages/ui`.
- **Usage**:
  - **ALWAYS** check `packages/ui` before creating a new component.
  - Import as: `import { Button } from "@repo/ui/components/button"` (or specific export path).
- **Creation**:
  - If a component is generic (e.g., "Card", "Modal", "Input"), it **MUST** be implemented in `packages/ui`, not locally in an app.
  - If implementing a feature-specific component (e.g., "JobCard"), build it in the app using atomic components from `@repo/ui`.
- **Icons**: Use `lucide-react`.

## 4. Coding Standards
- **File Naming**:
  - Components: `PascalCase.tsx` (e.g., `JobCard.tsx`).
  - Utilities/Hooks: `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`).
- **Code Style**:
  - Use `const` for variables.
  - Use `async/await` for asynchronous operations.
  - Prefer functional components with `React.FC` or just `function Component()`.
- **Aliases**: Use `@/*` for imports within apps (configured in `tsconfig.json`).
- **Dependencies**:
  - Do not duplicate dependencies. Check libraries in `packages/ui/package.json` vs app-specific `package.json`.
  - Preferred libs: `zod` (validation), `date-fns` (dates), `sonner` (toasts).

## 5. Agent Workflow Guidelines
- **Discovery**: Before editing, use `ls` or `find_by_name` to understand the folder structure of the specific app you are working on.
- **Safety**:
  - **NEVER** commit secrets. Check `.env.local`.
  - **NEVER** delete code without understanding its usage (search for usages first).
- **Proactive Implementation**:
  - If you see a missing shared component, propose adding it to `@repo/ui`.
  - When fixing a bug, check if it affects other apps in the monorepo.
